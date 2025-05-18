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
  "EKMFLGDQVZNTOWYHXUSPAIBRCJ",        /* Permutation for slow rotor      */
  "AJDKSIRUXBLHWTMCQGZNPYFVOE",        /* Permutation for medium rotor    */
  "BDFHJLCPRTXVZNYEIWGAKMUSQO"         /* Permutation for fast rotor      */
];

/* Constants that control the display of the current rotor setting */

const ROTOR_BGCOLOR = "#BBAA77";       /* Background color for the rotor  */
const ROTOR_WIDTH = 24;                /* Width of the setting indicator  */
const ROTOR_HEIGHT = 26;               /* Height of the setting indicator */
const ROTOR_COLOR = "Black";           /* Text color of the rotor         */
const ROTOR_LABEL_DY = 9;              /* Offset from center to baseline  */
const ROTOR_FONT = "Helvetica Neue-24";

/* This array specifies the coordinates of each rotor display */

const ROTOR_LOCATIONS = [
   { x: 232, y: 82 },
   { x: 317, y: 82 },
   { x: 400, y: 82 }
];



const REFLECTOR_PERMUTATION = "IXUHFEZDAOMTKQJWNSRLCYPBVG";



const KEY_RADIUS = 24;                 /* Outer radius of a key in pixels */
const KEY_BORDER = 3;                  /* Width of the key border         */
const KEY_BORDER_COLOR = "#CCCCCC";    /* Fill color of the key border    */
const KEY_BGCOLOR = "#666666";         /* Background color of the key     */
const KEY_UP_COLOR = "#CCCCCC";        /* Text color when the key is up   */
const KEY_DOWN_COLOR = "#CC3333";      /* Text color when the key is down */
const KEY_LABEL_DY = 10;               /* Offset from center to baseline  */
const KEY_FONT = "Helvetica Neue-Bold-28";

/* This array determines the coordinates of a key for each letter index */

const KEY_LOCATIONS = [
   { x: 140, y: 566 } /* A */,
   { x: 471, y: 640 } /* B */,
   { x: 319, y: 639 } /* C */,
   { x: 294, y: 567 } /* D */,
   { x: 268, y: 495 } /* E */,
   { x: 371, y: 567 } /* F */,
   { x: 448, y: 567 } /* G */,
   { x: 523, y: 567 } /* H */,
   { x: 650, y: 496 } /* I */,
   { x: 598, y: 567 } /* J */,
   { x: 674, y: 567 } /* K */,
   { x: 699, y: 641 } /* L */,
   { x: 624, y: 641 } /* M */,
   { x: 547, y: 640 } /* N */,
   { x: 725, y: 497 } /* O */,
   { x:  92, y: 639 } /* P */,
   { x: 115, y: 494 } /* Q */,
   { x: 345, y: 495 } /* R */,
   { x: 217, y: 566 } /* S */,
   { x: 420, y: 496 } /* T */,
   { x: 574, y: 496 } /* U */,
   { x: 395, y: 639 } /* V */,
   { x: 192, y: 494 } /* W */,
   { x: 242, y: 639 } /* X */,
   { x: 168, y: 639 } /* Y */,
   { x: 497, y: 496 } /* Z */
];

/* Constants that define the lamps above the Enigma keyboard */

const LAMP_RADIUS = 23;                /* Radius of a lamp in pixels      */
const LAMP_BORDER_COLOR = "#111111";   /* Line color of the lamp border   */
const LAMP_BGCOLOR = "#333333";        /* Background color of the lamp    */
const LAMP_OFF_COLOR = "#666666";      /* Text color when the lamp is off */
const LAMP_ON_COLOR = "#FFFF99";       /* Text color when the lamp is on  */
const LAMP_LABEL_DY = 9;               /* Offset from center to baseline  */
const LAMP_FONT = "Helvetica Neue-Bold-24";

/* This array determines the coordinates of a lamp for each letter index */

const LAMP_LOCATIONS = [
   { x: 144, y: 332 } /* A */,
   { x: 472, y: 403 } /* B */,
   { x: 321, y: 402 } /* C */,
   { x: 296, y: 333 } /* D */,
   { x: 272, y: 265 } /* E */,
   { x: 372, y: 333 } /* F */,
   { x: 448, y: 334 } /* G */,
   { x: 524, y: 334 } /* H */,
   { x: 650, y: 266 } /* I */,
   { x: 600, y: 335 } /* J */,
   { x: 676, y: 335 } /* K */,
   { x: 700, y: 403 } /* L */,
   { x: 624, y: 403 } /* M */,
   { x: 549, y: 403 } /* N */,
   { x: 725, y: 267 } /* O */,
   { x:  94, y: 401 } /* P */,
   { x: 121, y: 264 } /* Q */,
   { x: 347, y: 265 } /* R */,
   { x: 220, y: 332 } /* S */,
   { x: 423, y: 265 } /* T */,
   { x: 574, y: 266 } /* U */,
   { x: 397, y: 402 } /* V */,
   { x: 197, y: 264 } /* W */,
   { x: 246, y: 402 } /* X */,
   { x: 170, y: 401 } /* Y */,
   { x: 499, y: 265 } /* Z */
];

    let keyPressedIndex = -1;

    

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
        ctx.arc(x, y, KEY_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = KEY_BGCOLOR;
        ctx.fill();
        ctx.lineWidth = KEY_BORDER;
        ctx.strokeStyle = KEY_BORDER_COLOR;
        ctx.stroke();

        ctx.fillStyle = isPressed ? KEY_DOWN_COLOR : KEY_UP_COLOR;
        ctx.font = KEY_FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
    }
    
    function drawLamps() {
        for (let i = 0; i < LETTERS.length; i++) {
            const { x, y } = LAMP_LOCATIONS[i];
            drawLamp(x, y, LETTERS[i], i === keyPressedIndex);
        }
    }

    function drawLamp(x, y, label, isOn) {
        ctx.beginPath();
        ctx.arc(x, y, LAMP_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = LAMP_BGCOLOR;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = LAMP_BORDER_COLOR;
        ctx.stroke();

        ctx.fillStyle = isOn ? LAMP_ON_COLOR : LAMP_OFF_COLOR;
        ctx.font = "bold 18px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x, y);
    }

    function getKeyIndexAt(x, y) {
        for (let i = 0; i < KEY_LOCATIONS.length; i++) {
            const key = KEY_LOCATIONS[i];
            const dx = x - key.x;
            const dy = y - key.y;
            if (Math.sqrt(dx * dx + dy * dy) <= KEY_RADIUS) {
                return i;
            }
        }
        return -1;
    }
    
    
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotorIndex = getRotorIndexAt(x,y);
        if (rotorIndex != -1){
            rotors[rotorIndex].offset = (rotors[rotorIndex].offset + 1) % 26;
            drawKeyboard();
            return;
        }

        const index = getKeyIndexAt(x, y);
        if (index !== -1) {
            keyPressedIndex = index;
            if (advanceRotor(rotors[2])) {
                if (advanceRotor(rotors[1])) {
                    advanceRotor(rotors[0]);
                }
            }
            drawKeyboard();

            setTimeout(() => {
                keyPressedIndex = -1;
                drawKeyboard();
            }, 500);
        }
    });

   const rotors = ROTOR_PERMUTATIONS.map(p => ({
        permutation: p,
        offset: 0
    }));
    function getRotorLetter(offset) {
        return String.fromCharCode('A'.charCodeAt(0) + offset);
    }
    function drawRotors() {
        for (let i = 0; i < rotors.length; i++) {
            const { x, y } = ROTOR_LOCATIONS[i];
            const rotor = rotors[i];
            const displayLetter = getRotorLetter(rotor.offset);
            drawRotor(x, y, displayLetter);
        }
    }
    function advanceRotor(rotor) {
        rotor.offset = (rotor.offset + 1) % 26;
        return rotor.offset === 0; 
    }





    function drawRotor(x, y, label) {
        ctx.fillStyle = ROTOR_BGCOLOR;
        ctx.fillRect(x, y, ROTOR_WIDTH, ROTOR_HEIGHT);
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, ROTOR_WIDTH, ROTOR_HEIGHT);

        ctx.fillStyle = ROTOR_COLOR;
        ctx.font = "24px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + ROTOR_WIDTH / 2, y + ROTOR_HEIGHT / 2 + ROTOR_LABEL_DY / 2);
    }

    function getRotorIndexAt(x, y) {
        for (let i = 0; i < ROTOR_LOCATIONS.length; i++) {
            const { x: rx, y: ry } = ROTOR_LOCATIONS[i];
            if (
                x >= rx &&
                x <= rx + ROTOR_WIDTH &&
                y >= ry &&
                y <= ry + ROTOR_HEIGHT
            ) {
                return i;
            }
        }
        return -1;
    }


    


});


