type GeneratePasswordOptions = {
    length?: number;
};

const LOWERCASE = "abcdefghijkmnpqrstuvwxyz";
const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const NUMBERS = "23456789";

export function generatePassword(
    options: GeneratePasswordOptions = {}
): string {
    const { length = 12 } = options;

    if (length < 3) {
        throw new Error(
            "Password length must be at least 3 characters."
        );
    }

    const getRandomChar = (chars: string): string => {
        const array = new Uint32Array(1);

        crypto.getRandomValues(array);

        return chars[array[0] % chars.length];
    };

    const password: string[] = [
        getRandomChar(LOWERCASE),
        getRandomChar(UPPERCASE),
        getRandomChar(NUMBERS)
    ];

    const allChars =
        LOWERCASE +
        UPPERCASE +
        NUMBERS;

    while (password.length < length) {
        password.push(
            getRandomChar(allChars)
        );
    }

    // Fisher-Yates shuffle
    for (let i = password.length - 1; i > 0; i--) {
        const array = new Uint32Array(1);

        crypto.getRandomValues(array);

        const j = array[0] % (i + 1);

        [password[i], password[j]] = [
            password[j],
            password[i]
        ];
    }

    return password.join("");
}

export function generateReadablePassword(): string {
    const chunk = () => generatePassword({ length: 4 });

    return `${chunk()}-${chunk()}-${chunk()}`;
}