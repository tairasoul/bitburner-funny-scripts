export function vignere(plaintext, keyword) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlnbmVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jY3QvdmlnbmVyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsT0FBTyxDQUFDLFNBQWlCLEVBQUUsT0FBZTtJQUN0RCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDckMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBRXBCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFDO1FBRS9DLDhDQUE4QztRQUM5QyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNoQyxVQUFVLElBQUksYUFBYSxDQUFDO1lBQzVCLFNBQVM7U0FDWjtRQUVELE1BQU0saUJBQWlCLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDaEYsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7UUFFNUUsTUFBTSxjQUFjLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQzlFLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdkQsVUFBVSxJQUFJLGFBQWEsS0FBSyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3ZHO0lBRUQsT0FBTyxVQUFVLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB2aWduZXJlKHBsYWludGV4dDogc3RyaW5nLCBrZXl3b3JkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBBQ2hhckNvZGUgPSAnQScuY2hhckNvZGVBdCgwKTtcbiAgICBjb25zdCBrZXl3b3JkTGVuZ3RoID0ga2V5d29yZC5sZW5ndGg7XG4gICAgbGV0IGNpcGhlcnRleHQgPSAnJztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxhaW50ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBsYWludGV4dENoYXIgPSBwbGFpbnRleHRbaV07XG4gICAgICAgIGNvbnN0IGtleXdvcmRDaGFyID0ga2V5d29yZFtpICUga2V5d29yZExlbmd0aF07XG4gICAgICAgIFxuICAgICAgICAvLyBTa2lwIG5vbi1hbHBoYWJldGljIGNoYXJhY3RlcnMgaW4gcGxhaW50ZXh0XG4gICAgICAgIGlmICghcGxhaW50ZXh0Q2hhci5tYXRjaCgvW0EtWl0vaSkpIHtcbiAgICAgICAgICAgIGNpcGhlcnRleHQgKz0gcGxhaW50ZXh0Q2hhcjtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGxhaW50ZXh0Q2hhckNvZGUgPSBwbGFpbnRleHRDaGFyLnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKSAtIEFDaGFyQ29kZTtcbiAgICAgICAgY29uc3Qga2V5d29yZENoYXJDb2RlID0ga2V5d29yZENoYXIudG9VcHBlckNhc2UoKS5jaGFyQ29kZUF0KDApIC0gQUNoYXJDb2RlO1xuXG4gICAgICAgIGNvbnN0IGNpcGhlckNoYXJDb2RlID0gKHBsYWludGV4dENoYXJDb2RlICsga2V5d29yZENoYXJDb2RlKSAlIDI2ICsgQUNoYXJDb2RlO1xuICAgICAgICBjb25zdCBjaXBoZXJDaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjaXBoZXJDaGFyQ29kZSk7XG5cbiAgICAgICAgY2lwaGVydGV4dCArPSBwbGFpbnRleHRDaGFyID09PSBwbGFpbnRleHRDaGFyLnRvVXBwZXJDYXNlKCkgPyBjaXBoZXJDaGFyIDogY2lwaGVyQ2hhci50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjaXBoZXJ0ZXh0O1xufSJdfQ==