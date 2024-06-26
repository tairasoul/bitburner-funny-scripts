export function sanitizeParentheses(data) {
    let left = 0;
    let right = 0;
    const res = [];
    for (let i = 0; i < data.length; ++i) {
        if (data[i] === '(') {
            ++left;
        }
        else if (data[i] === ')') {
            left > 0 ? --left : ++right;
        }
    }
    function dfs(pair, index, left, right, s, solution, res) {
        if (s.length === index) {
            if (left === 0 && right === 0 && pair === 0) {
                for (let i = 0; i < res.length; i++) {
                    if (res[i] === solution) {
                        return;
                    }
                }
                res.push(solution);
            }
            return;
        }
        if (s[index] === '(') {
            if (left > 0) {
                dfs(pair, index + 1, left - 1, right, s, solution, res);
            }
            dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
        }
        else if (s[index] === ')') {
            if (right > 0)
                dfs(pair, index + 1, left, right - 1, s, solution, res);
            if (pair > 0)
                dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
        }
        else {
            dfs(pair, index + 1, left, right, s, solution + s[index], res);
        }
    }
    dfs(0, 0, left, right, data, '', res);
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyZW50aGVzZXNTYW5pdGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jY3QvcGFyZW50aGVzZXNTYW5pdGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBWTtJQUN4QyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUE7SUFDWixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7SUFDYixNQUFNLEdBQUcsR0FBYSxFQUFFLENBQUE7SUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDbEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ2pCLEVBQUUsSUFBSSxDQUFBO1NBQ1Q7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFBO1NBQzlCO0tBQ0o7SUFFRCxTQUFTLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBYSxFQUFFLElBQVksRUFBRSxLQUFhLEVBQUUsQ0FBUyxFQUFFLFFBQWdCLEVBQUUsR0FBYTtRQUM3RyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO1lBQ3BCLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7Z0JBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7d0JBQ3JCLE9BQU07cUJBQ1Q7aUJBQ0o7Z0JBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTthQUNyQjtZQUNELE9BQU07U0FDVDtRQUNELElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUNsQixJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUE7YUFDMUQ7WUFDRCxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDckU7YUFBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDekIsSUFBSSxLQUFLLEdBQUcsQ0FBQztnQkFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN0RSxJQUFJLElBQUksR0FBRyxDQUFDO2dCQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUNuRjthQUFNO1lBQ0gsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDakU7SUFDTCxDQUFDO0lBQ0QsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRXJDLE9BQU8sR0FBRyxDQUFBO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gc2FuaXRpemVQYXJlbnRoZXNlcyhkYXRhOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAwXG4gICAgICAgIGxldCByaWdodCA9IDBcbiAgICAgICAgY29uc3QgcmVzOiBzdHJpbmdbXSA9IFtdXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV0gPT09ICcoJykge1xuICAgICAgICAgICAgICAgICsrbGVmdFxuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhW2ldID09PSAnKScpIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID4gMCA/IC0tbGVmdCA6ICsrcmlnaHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRmcyhwYWlyOiBudW1iZXIsIGluZGV4OiBudW1iZXIsIGxlZnQ6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgczogc3RyaW5nLCBzb2x1dGlvbjogc3RyaW5nLCByZXM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBpZiAocy5sZW5ndGggPT09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGxlZnQgPT09IDAgJiYgcmlnaHQgPT09IDAgJiYgcGFpciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc1tpXSA9PT0gc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChzb2x1dGlvbilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc1tpbmRleF0gPT09ICcoJykge1xuICAgICAgICAgICAgICAgIGlmIChsZWZ0ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZnMocGFpciwgaW5kZXggKyAxLCBsZWZ0IC0gMSwgcmlnaHQsIHMsIHNvbHV0aW9uLCByZXMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRmcyhwYWlyICsgMSwgaW5kZXggKyAxLCBsZWZ0LCByaWdodCwgcywgc29sdXRpb24gKyBzW2luZGV4XSwgcmVzKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzW2luZGV4XSA9PT0gJyknKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpZ2h0ID4gMCkgZGZzKHBhaXIsIGluZGV4ICsgMSwgbGVmdCwgcmlnaHQgLSAxLCBzLCBzb2x1dGlvbiwgcmVzKVxuICAgICAgICAgICAgICAgIGlmIChwYWlyID4gMCkgZGZzKHBhaXIgLSAxLCBpbmRleCArIDEsIGxlZnQsIHJpZ2h0LCBzLCBzb2x1dGlvbiArIHNbaW5kZXhdLCByZXMpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRmcyhwYWlyLCBpbmRleCArIDEsIGxlZnQsIHJpZ2h0LCBzLCBzb2x1dGlvbiArIHNbaW5kZXhdLCByZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGZzKDAsIDAsIGxlZnQsIHJpZ2h0LCBkYXRhLCAnJywgcmVzKVxuXG4gICAgICAgIHJldHVybiByZXNcbn0iXX0=