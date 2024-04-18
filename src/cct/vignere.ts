export function vignere(plaintext: string, keyword: string) {
    const ACharCode = 'A'.charCodeAt(0);
    const keywordLength = keyword.length;
    let ciphertext = '';

    for (let i = 0; i < plaintext.length; i++) {
        const plaintextChar = plaintext[i];
        const keywordChar = keyword[i % keywordLength];
        
        // Skip non-alphabetic characters in plaintext
        if (!plaintextChar.match(/[A-Z]/i)) {
            ciphertext += plaintextChar;
            continue;
        }

        const plaintextCharCode = plaintextChar.toUpperCase().charCodeAt(0) - ACharCode;
        const keywordCharCode = keywordChar.toUpperCase().charCodeAt(0) - ACharCode;

        const cipherCharCode = (plaintextCharCode + keywordCharCode) % 26 + ACharCode;
        const cipherChar = String.fromCharCode(cipherCharCode);

        ciphertext += plaintextChar === plaintextChar.toUpperCase() ? cipherChar : cipherChar.toLowerCase();
    }

    return ciphertext;
}