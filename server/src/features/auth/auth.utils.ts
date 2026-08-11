import { mailer } from "@/lib";
import { generateOtpEmailHtml, OtpEmailType } from "./templates/otpEmail";
import { throwBadInput, generateOtp } from "@/utils";
import * as argon2 from "argon2";

/**
 * Sends an OTP (One-Time Password) to the specified email address.
 *
 * This method utilizes Nodemailer to send an HTML-formatted email containing
 * the generated OTP. In development mode, it logs the OTP to the console
 * instead of actually sending the email to save resources and avoid spam.
 *
 * Any errors encountered during the sending process are logged but do not
 * throw, ensuring the main application flow is not blocked.
 *
 * @async
 * @param {string} email - The recipient's email address.
 * @param {string} firstName - The recipient's first name for personalization.
 * @param {string} otp - The one-time password to send.
 * @param {string} subject - The subject line of the email.
 * @param {OtpEmailType} [type='signup'] - The type of OTP email template to use.
 * @returns {Promise<any>} Information about the sent email, or undefined if skipped/failed.
 */
export async function sendOtpEmail(
    email: string,
    firstName: string,
    otp: string,
    subject: string,
    type: OtpEmailType = 'signup'
) {

    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
        console.log(`[DEVELOPMENT] OTP for ${email}: ${otp}`);
        return;
    }

    try {
        const info = await mailer.sendMail({
            from: `"StockPilot" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject,
            html: generateOtpEmailHtml(otp, firstName, type),
        });

        if (isDevelopment) {
            console.log(
                "Email sent successfully!",
                "Message ID:",
                info.messageId
            );
        }

        return info;
    } catch (error) {
        if (isDevelopment) {
            console.error(
                "Failed to send email with Nodemailer:",
                error
            );
        }
        // Non-blocking error
    }
}

/**
 * Enforces a 60-second cooldown period between OTP requests.
 *
 * This method calculates the time elapsed since the last OTP generation
 * based on the provided expiration date (assuming exactly 15 minutes of validity).
 * If less than 60 seconds have passed, it throws a Bad Input error.
 *
 * @param {Date} expiresAt - The expiration date of the previously generated OTP.
 * @returns {void}
 * @throws {Error} If the user attempts to request an OTP before the cooldown period ends.
 */
export function checkOtpRateLimit(expiresAt: Date) {
    // Since expiresAt is always set to exactly 15 mins after generation, we can deduce the generation time
    const otpGeneratedAt = new Date(expiresAt.getTime() - 15 * 60 * 1000);
    const msSinceLastOtp = Date.now() - otpGeneratedAt.getTime();

    if (msSinceLastOtp < 60000) {
        const secondsLeft = Math.ceil((60000 - msSinceLastOtp) / 1000);
        throwBadInput(
            `Please wait ${secondsLeft} seconds before requesting a new OTP.`
        );
    }
}

/**
 * Verifies if an OTP is still valid based on its expiration date.
 *
 * This method checks the provided `expiresAt` date against the current time.
 * If the current time has passed the expiration date, it throws a Bad Input error.
 *
 * @param {Date} expiresAt - The expiration date of the OTP.
 * @returns {void}
 * @throws {Error} If the OTP has expired.
 */
export function checkOtpExpiration(expiresAt: Date) {
    if (expiresAt < new Date()) {
        throwBadInput("OTP has expired. Please request a new one.");
    }
}

/**
 * Generates a new OTP, its cryptographic hash, and an expiration timestamp.
 *
 * This method creates a random OTP, hashes it using argon2 for secure storage,
 * and sets an expiration time of 15 minutes from the current time.
 *
 * @async
 * @returns {Promise<{otp: string, hashedOtp: string, expiresAt: Date}>} An object containing the plain OTP, hashed OTP, and expiration date.
 */
export async function generateOtpData() {
    const otp = generateOtp();
    const hashedOtp = await argon2.hash(otp);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    return { otp, hashedOtp, expiresAt };
}

/**
 * Processes a request to resend an OTP.
 *
 * This method coordinates the rate limiting, OTP generation, record updating,
 * and email sending for an OTP resend action. It abstracts the common logic
 * shared across different features (e.g., signup, password reset).
 *
 * @async
 * @param {string} email - The user's email address.
 * @param {string} firstName - The user's first name.
 * @param {Date} currentExpiresAt - The expiration date of the current OTP to enforce rate limits.
 * @param {(email: string, otpHash: string, newExpiresAt: Date) => Promise<any>} updateRecordFn - A callback function to update the corresponding database record.
 * @param {string} emailSubject - The subject line for the resend email.
 * @param {OtpEmailType} emailType - The type of email template to use.
 * @returns {Promise<any>} The updated database record returned by `updateRecordFn`.
 * @throws {Error} If the rate limit is exceeded.
 */
export async function processOtpResend(
    email: string,
    firstName: string,
    currentExpiresAt: Date,
    updateRecordFn: (email: string, otpHash: string, newExpiresAt: Date) => Promise<any>,
    emailSubject: string,
    emailType: OtpEmailType
) {
    checkOtpRateLimit(currentExpiresAt);
    const { otp, hashedOtp, expiresAt: newExpiresAt } = await generateOtpData();
    const updatedRecord = await updateRecordFn(email, hashedOtp, newExpiresAt);
    await sendOtpEmail(email, firstName, otp, emailSubject, emailType);
    return updatedRecord;
}

/**
 * Verifies if a given plain text matches the provided argon2 hash.
 *
 * This method compares the provided `plainText` against the `hash`.
 * If the verification fails, it either calls the provided `customErrorFn`
 * or throws a standard "Invalid OTP" Bad Input error.
 *
 * @async
 * @param {string} hash - The argon2 hashed string to verify against.
 * @param {string} plainText - The plain text string to verify.
 * @param {() => never} [customErrorFn] - An optional function to call when verification fails.
 * @returns {Promise<void>} Resolves if the hash matches the plain text.
 * @throws {Error} If the hash does not match and no custom error function is provided.
 */
export async function verifyHash(
    hash: string,
    plainText: string,
    customErrorFn?: () => never
) {
    const isValid = await argon2.verify(hash, plainText);
    if (!isValid) {
        if (customErrorFn) customErrorFn();
        else throwBadInput("Invalid OTP");
    }
}
