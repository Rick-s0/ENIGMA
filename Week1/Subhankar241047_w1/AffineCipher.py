### The code at first convert the plain text into an encrypted text using the index of each letter multiplied by a certain number then addintion
# of number b and dividing by 26 so that we get the encrypted letetr
# Then we decrypt each  letter using the formula a*x = 1 mod 26
#for this we first find a_inv then decrypting each letters




def affine_cipher(text, a, b):
    ciphered_text = "" 
    for char in text:
        if char.isalpha():
            if char.isupper():
                x = ord(char) - ord('A')
                ciphered_text += chr((((a % 26) * x + (b % 26)) % 26) + ord('A'))
            elif char.islower():
                x = ord(char) - ord('a')
                ciphered_text += chr((((a % 26) * x + (b % 26)) % 26) + ord('a'))
            else:
                ciphered_text += char
    return ciphered_text


def affine_decipher(text, a, b):
    deciphered_text = ""
    for i in range(1, 26):
        if (a * i) % 26 == 1:
            a_inv = i
            break
    for char in text:
        if char.isalpha():
            if char.isupper():
                x = ord(char) - ord('A')
                deciphered_text += chr(((a_inv*(x - b)) % 26) + ord('A'))
            elif char.islower():
                x = ord(char)- ord('a')
                deciphered_text += chr(((a_inv*(x - b)) % 26) + ord('a'))
            else:
                deciphered_text += char
    return deciphered_text

a = int(input("Enter a number co-prime to 26: "))
b = int(input("Enter any number: "))

plaintext = input("Enter Plain Text : ")
cipher = affine_cipher(plaintext, a, b)
print("Encrypted:", cipher)

decrypted = affine_decipher(cipher, a, b)
print("Decrypted:", decrypted)

            


