export type OtpEmailType = 'signup' | 'forgot_password';

export const generateOtpEmailHtml = (otp: string, firstName: string, type: OtpEmailType = 'signup') => {
    const title = type === 'signup' ? 'Verify your email address' : 'Reset your password';
    const message = type === 'signup' 
        ? 'Welcome to StockPilot! To complete your sign up and verify your account, please use the following one-time password (OTP):'
        : 'We received a request to reset your password for your StockPilot account. Please use the following one-time password (OTP) to proceed:';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f9fafb;
          color: #111827;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 500px;
          margin: 40px auto;
          background-color: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .header {
          background-color: #fbbf24; /* amber-400 */
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #000000;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 32px 24px;
          text-align: center;
        }
        .content h2 {
          margin-top: 0;
          font-size: 20px;
          font-weight: 700;
          color: #111827;
        }
        .content p {
          font-size: 15px;
          line-height: 1.6;
          margin-top: 0;
          color: #4b5563;
        }
        .otp-container {
          text-align: center;
          margin: 32px 0;
        }
        .otp-code {
          display: inline-block;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 6px;
          color: #111827;
          background-color: #f3f4f6;
          padding: 16px 32px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        .footer {
          text-align: center;
          padding: 24px;
          background-color: #f9fafb;
          border-top: 1px solid #f3f4f6;
          color: #6b7280;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>StockPilot</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p>Hi ${firstName},</p>
          <p>${message}</p>
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} StockPilot. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
};
