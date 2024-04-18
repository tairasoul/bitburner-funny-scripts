// taken from https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js

export function compressLZ(plain: string) {
    let cur_state = Array.from(Array(10), () => Array(10).fill(null));
    let new_state = Array.from(Array(10), () => Array(10));

    // @ts-ignore
    function set(state, i, j, str) {
        const current = state[i][j];
        if (current == null || str.length < current.length) {
            state[i][j] = str;
        } else if (str.length === current.length && Math.random() < 0.5) {
            // if two strings are the same length, pick randomly so that
            // we generate more possible inputs to Compression II
            state[i][j] = str;
        }
    }

    // initial state is a literal of length 1
    cur_state[0][1] = "";

    for (let i = 1; i < plain.length; ++i) {
        for (const row of new_state) {
            row.fill(null);
        }
        const c = plain[i];

        // handle literals
        for (let length = 1; length <= 9; ++length) {
            const string = cur_state[0][length];
            if (string == null) {
                continue;
            }

            if (length < 9) {
                // extend current literal
                set(new_state, 0, length + 1, string);
            } else {
                // start new literal
                set(new_state, 0, 1, string + "9" + plain.substring(i - 9, i) + "0");
            }

            for (let offset = 1; offset <= Math.min(9, i); ++offset) {
                if (plain[i - offset] === c) {
                    // start new backreference
                    set(new_state, offset, 1, string + length + plain.substring(i - length, i));
                }
            }
        }

        // handle backreferences
        for (let offset = 1; offset <= 9; ++offset) {
            for (let length = 1; length <= 9; ++length) {
                const string = cur_state[offset][length];
                if (string == null) {
                    continue;
                }

                if (plain[i - offset] === c) {
                    if (length < 9) {
                        // extend current backreference
                        set(new_state, offset, length + 1, string);
                    } else {
                        // start new backreference
                        set(new_state, offset, 1, string + "9" + offset + "0");
                    }
                }

                // start new literal
                set(new_state, 0, 1, string + length + offset);

                // end current backreference and start new backreference
                for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
                    if (plain[i - new_offset] === c) {
                        set(new_state, new_offset, 1, string + length + offset + "0");
                    }
                }
            }
        }

        const tmp_state = new_state;
        new_state = cur_state;
        cur_state = tmp_state;
    }

    let result = null;

    for (let len = 1; len <= 9; ++len) {
        let string = cur_state[0][len];
        if (string == null) {
            continue;
        }

        string += len + plain.substring(plain.length - len, plain.length);
        if (result == null || string.length < result.length) {
            result = string;
        } else if (string.length == result.length && Math.random() < 0.5) {
            result = string;
        }
    }

    for (let offset = 1; offset <= 9; ++offset) {
        for (let len = 1; len <= 9; ++len) {
            let string = cur_state[offset][len];
            if (string == null) {
                continue;
            }

            string += len + "" + offset;
            if (result == null || string.length < result.length) {
                result = string;
            } else if (string.length == result.length && Math.random() < 0.5) {
                result = string;
            }
        }
    }

    // @ts-ignore
    return result ?? "";
}