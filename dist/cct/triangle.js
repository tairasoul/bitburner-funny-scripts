export function triangle(triangle) {
    const n = triangle.length;
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
            triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
        }
    }
    return triangle[0][0];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpYW5nbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY2N0L3RyaWFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSxRQUFRLENBQUMsUUFBb0I7SUFDekMsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUUxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxRTtLQUNKO0lBRUQsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB0cmlhbmdsZSh0cmlhbmdsZTogbnVtYmVyW11bXSkge1xuICAgIGNvbnN0IG4gPSB0cmlhbmdsZS5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IG4gLSAyOyBpID49IDA7IGktLSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSBpOyBqKyspIHtcbiAgICAgICAgICAgIHRyaWFuZ2xlW2ldW2pdICs9IE1hdGgubWluKHRyaWFuZ2xlW2kgKyAxXVtqXSwgdHJpYW5nbGVbaSArIDFdW2ogKyAxXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRyaWFuZ2xlWzBdWzBdO1xufSJdfQ==