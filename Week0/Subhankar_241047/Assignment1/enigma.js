document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('keyboardCanvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        alert("Canvas context not found!");
        return;
    }
    canvas.width = 765;
    canvas.height = 730;

    const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const ROTOR_PERMUTATIONS = [
        "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
        "AJDKSIRUXBLHWTMCQGZNPYFVOE",
        "BDFHJLCPRTXVZNYEIWGAKMUSQO"
    ];

    const ROTOR_TURNOVERS = [
        LETTERS.indexOf('Q'),  // Rotor I
        LETTERS.indexOf('E'),  // Rotor II
        LETTERS.indexOf('V')   // Rotor III
    ];

    const ROTOR_LOCATIONS = [
        { x: 232, y: 82 },
        { x: 317, y: 82 },
        { x: 400, y: 82 }
    ];

    const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";

    const KEY_LOCATIONS = [
        { x: 140, y: 566 }, { x: 471, y: 640 }, { x: 319, y: 639 }, { x: 294, y: 567 },
        { x: 268, y: 495 }, { x: 371, y: 567 }, { x: 448, y: 567 }, { x: 523, y: 567 },
        { x: 650, y: 496 }, { x: 598, y: 567 }, { x: 674, y: 567 }, { x: 699, y: 641 },
        { x: 624, y: 641 }, { x: 547, y: 640 }, { x: 725, y: 497 }, { x:  92, y: 639 },
        { x: 115, y: 494 }, { x: 345, y: 495 }, { x: 217, y: 566 }, { x: 420, y: 496 },
        { x: 574, y: 496 }, { x: 395, y: 639 }, { x: 192, y: 494 }, { x: 242, y: 639 },
        { x: 168, y: 639 }, { x: 497, y: 496 }
    ];

    const LAMP_LOCATIONS = [
        { x: 144, y: 332 }, { x: 472, y: 403 }, { x: 321, y: 402 }, { x: 296, y: 333 },
        { x: 272, y: 265 }, { x: 372, y: 333 }, { x: 448, y: 334 }, { x: 524, y: 334 },
        { x: 650, y: 266 }, { x: 600, y: 335 }, { x: 676, y: 335 }, { x: 700, y: 403 },
        { x: 624, y: 403 }, { x: 549, y: 403 }, { x: 725, y: 267 }, { x:  94, y: 401 },
        { x: 121, y: 264 }, { x: 347, y: 265 }, { x: 220, y: 332 }, { x: 423, y: 265 },
        { x: 574, y: 266 }, { x: 397, y: 402 }, { x: 197, y: 264 }, { x: 246, y: 402 },
        { x: 170, y: 401 }, { x: 499, y: 265 }
    ];

    let keyPressedIndex = -1;

    const rotors = ROTOR_PERMUTATIONS.map(p => ({
        permutation: p,
        offset: 0
    }));

    function encryptLetter(index) {
        let c = index;

        // Rotor forward path (right to left)
        for (let i = 2; i >= 0; i--) {
            const offset = rotors[i].offset;
            c = (c + offset) % 26;
            c = LETTERS.indexOf(rotors[i].permutation[c]);
            c = (c - offset + 26) % 26;
        }

        // Reflector
        c = LETTERS.indexOf(REFLECTOR_PERMUTATION[c]);

        // Rotor backward path (left to right)
        for (let i = 0; i < 3; i++) {
            const offset = rotors[i].offset;
            const idx = (c + offset) % 26;
            const letter = LETTERS[idx];
            const inverseIndex = rotors[i].permutation.indexOf(letter);
            c = (inverseIndex - offset + 26) % 26;
        }

        return c;
    }

    function stepRotors() {
        const r0 = rotors[2]; // Right
        const r1 = rotors[1]; // Middle
        const r2 = rotors[0]; // Left

        const r1AtTurnover = r1.offset === ROTOR_TURNOVERS[1];
        const r0AtTurnover = r0.offset === ROTOR_TURNOVERS[0];

        // Double stepping condition
        if (r1AtTurnover) {
            r2.offset = (r2.offset + 1) % 26;
            r1.offset = (r1.offset + 1) % 26;
        } else if (r0AtTurnover) {
            r1.offset = (r1.offset + 1) % 26;
        }

        r0.offset = (r0.offset + 1) % 26;
    }

    const img = new Image();
    img.src = 'EnigmaTopView.png';
    img.onload = () => {
        window.scrollTo(0, 0);
        drawKeyboard();
    };

    function drawKeyboard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        drawLamps();
        drawKeys();
        drawRotors();
    }

    function drawKeys() {
        for (let i = 0; i < LETTERS.length; i++) {
            const { x, y } = KEY_LOCATIONS[i];
            drawKey(x, y, LETTERS[i], i === keyPressedIndex);
        }
    }

    function drawKey(x, y, label, isPressed) {
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, 2 * Math.PI);
        ctx.fillStyle = "#666666";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#CCCCCC";
        ctx.stroke();
        ctx.fillStyle = isPressed ? "#CC3333" : "#CCCCCC";
        ctx.font = "bold 28px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
    }

    function drawLamps() {
        for (let i = 0; i < LETTERS.length; i++) {
            const { x, y } = LAMP_LOCATIONS[i];
            drawLamp(x, y, LETTERS[i], i === encryptedIndex);
        }
    }

    function drawLamp(x, y, label, isOn) {
        ctx.beginPath();
        ctx.arc(x, y, 23, 0, 2 * Math.PI);
        ctx.fillStyle = "#333333";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#111111";
        ctx.stroke();
        ctx.fillStyle = isOn ? "#FFFF99" : "#666666";
        ctx.font = "bold 24px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
    }

    function drawRotors() {
        for (let i = 0; i < rotors.length; i++) {
            const { x, y } = ROTOR_LOCATIONS[i];
            drawRotor(x, y, LETTERS[rotors[i].offset]);
        }
    }

    function drawRotor(x, y, label) {
        ctx.fillStyle = "#BBAA77";
        ctx.fillRect(x, y, 26, 26);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, 26, 28);
        ctx.fillStyle = "black";
        ctx.font = "24px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + 12, y + 14);
    }

    function getKeyIndexAt(x, y) {
        for (let i = 0; i < KEY_LOCATIONS.length; i++) {
            const dx = x - KEY_LOCATIONS[i].x;
            const dy = y - KEY_LOCATIONS[i].y;
            if (Math.sqrt(dx * dx + dy * dy) <= 24) return i;
        }
        return -1;
    }

    function getRotorIndexAt(x, y) {
        for (let i = 0; i < ROTOR_LOCATIONS.length; i++) {
            const { x: rx, y: ry } = ROTOR_LOCATIONS[i];
            if (x >= rx && x <= rx + 24 && y >= ry && y <= ry + 26) return i;
        }
        return -1;
    }

    let encryptedIndex = -1;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotorIndex = getRotorIndexAt(x, y);
        if (rotorIndex !== -1) {
            rotors[rotorIndex].offset = (rotors[rotorIndex].offset + 1) % 26;
            drawKeyboard();
            return;
        }

        const index = getKeyIndexAt(x, y);
        if (index !== -1) {
            keyPressedIndex = index;
            stepRotors();
            encryptedIndex = encryptLetter(index);
            drawKeyboard();

            setTimeout(() => {
                keyPressedIndex = -1;
                encryptedIndex = -1;
                drawKeyboard();
            }, 500);
        }
    });
});
