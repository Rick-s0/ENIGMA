function reflect(index, reflector) {
    const reflectedLetter = reflector[index];
    return reflectedLetter.charCodeAt(0) - 'A'.charCodeAt(0);
}

function reversePath(index, permutation, offset) {
    const shiftedIndex = (index + offset + 26) % 26;
    const letter = String.fromCharCode('A'.charCodeAt(0) + shiftedIndex);
    const fIndex = permutation.indexOf(letter);


    return (fIndex - offset + 26) % 26;
}
