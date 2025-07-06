# Project Enigma

**Electronics Club – IIT Kanpur**

---

The project is developed both as a software simulator and a hardware replica, offering insight into classical encryption systems and their implementation.

Mentors :

Kshitij Bhardwaj

Tanvi Manhas

Kamal Jaiswal

Shrasti Dwivedi
---

## 1. Introduction to Classical Ciphers

### 1.1 Caesar Cipher

A simple substitution cipher where each letter in the plaintext is shifted by a fixed number (key) of positions.

**Drawbacks:**

- Only 25 possible shifts – vulnerable to brute-force  
- Frequency analysis is easy due to unchanged letter frequency  
- Very small key space  
- Limited to alphabetical input  

---

### 1.2 Affine Cipher

A substitution cipher using the formula:  
`E(x) = (a·x + b) mod 26`, where `x` is the letter index.

**Decryption:**  
`D(x) = a⁻¹(x − b) mod 26`

**Example (a = 5, b = 8):**  
HELLO → RCLLA

**Drawbacks:**

- Limited key space  
- Vulnerable to frequency analysis  
- Susceptible to known-plaintext attacks  

---

### 1.3 Enigma Machine

A complex electro-mechanical cipher machine from WWII. Encryption varies with each keystroke due to rotor advancement.

**Components:**

1. **Plugboard:** Swaps letters  
2. **Rotors:** Substitute and rotate with each keypress  
3. **Reflector:** Sends signal back through rotors  
4. **Rotor Stepping:** Changes encryption path dynamically  
5. **Reversed Path:** Output reprocessed through plugboard  

**Advantages:**

- Dynamic substitution  
- Over 10¹¹⁴ possible configurations  
- Resistant to frequency analysis  

---

## 2. Objectives

### 2.1 Software-Based Enigma Simulator

- Full Enigma simulation: plugboard, rotors, reflector  
- User-configurable settings: rotor types, positions, plugboard  
- GUI implementation using JavaScript and PySimpleGUI  
- Support for encryption/decryption with the same settings  
- Import/export of configurations and messages  
- Modular, object-oriented codebase  

---

### 2.2 Hardware-Based Enigma Replica

- Replica using Arduino Nano/Uno  
- Pushbuttons or keyboard for input  
- Rotor logic with LEDs and motors  
- LCD output to display ciphertext  
- Manual rotor control using rotary encoders  
- Functional plugboard simulated via switches or digital interface  

---

## 3. Online Simulation

Initial inspiration came from a Stanford assignment on simulating the Enigma Machine.

**Assignment Link:**  
[https://web.stanford.edu/class/cs106j/handouts/37-Assignment5.pdf](https://web.stanford.edu/class/cs106j/handouts/37-Assignment5.pdf)

---

## 4. Hardware Implementation

### 4.1 Arduino Microcontroller

- Receives data from PC via serial  
- Executes encryption  
- Displays ciphertext on 16x2 LCD  
- Uses rotary encoder for real-time rotor adjustments  

### 4.2 LCD Display

- I2C/Parallel interface  
- Displays rotor positions and encrypted output  
- Feedback for user actions  

### 4.3 Rotary Encoder

- Rotate to change rotor offsets  
- Push to switch active rotor  
- Updates displayed configuration  

### 4.4 Serial Communication Protocol

*To be defined depending on system design*

### 4.5 Circuit and PCB Design

Includes wiring diagrams and PCB schematics for:

- Rotary Encoder  
- LCD  
- Arduino Connections  

---

## 5. Software Architecture

### 5.1 Protothreads in Embedded Systems

**What are Protothreads?**  
Lightweight, stackless cooperative threads (coroutines) for memory-limited systems.

```c
Thread SerialInputThread:
    PT_BEGIN()
    loop forever:
        PT_WAIT_UNTIL(serialAvailable())
        message = readSerial()
        parseMessage(message)
    PT_END()

Thread EncryptionThread:
    PT_BEGIN()
    loop forever:
        PT_WAIT_UNTIL(newMessageAvailable)
        for each letter in message:
            StepRotors()
            encrypted = EncryptLetter(letter, rotorPositions, plugboard)
            append encrypted to output
    PT_END()

Thread DisplayThread:
    PT_BEGIN()
    loop forever:
        updateLCD(output)
        delay(100 ms)
    PT_END()
```

---

### 5.2 Enigma Logic in C

This section covers the core Enigma encryption process implemented in C.

**Includes:**

- Fixed rotor and reflector wirings  
- Rotor stepping mechanism  
- Plugboard and sketcherboard support  
- Letter-to-index conversions  
- Encryption buffer handling  

```pseudocode
Function EncryptLetter(inputLetter, rotorPositions, plugboardMap):
    // Step 1: Plugboard
    letter = plugboardMap[inputLetter]

    // Step 2: Forward through rotors
    for rotor in rotors (from right to left):
        index = (alphabetIndex(letter) + rotor.position) % 26
        letter = rotor.mapping[index]

    // Step 3: Reflector
    letter = reflectorMap[letter]

    // Step 4: Reverse through rotors
    for rotor in rotors (from left to right):
        index = rotor.mapping.index(letter)
        letter = alphabet[(index - rotor.position + 26) % 26]

    // Step 5: Plugboard again
    letter = plugboardMap[letter]

    return letter
```

```pseudocode
Function StepRotors():
    // Rightmost rotor always steps
    rotor[0].position += 1
    if rotor[0].position == notch[0]:
        rotor[1].position += 1
        if rotor[1].position == notch[1]:
            rotor[2].position += 1
```

---
