function applyPermutation(index, permutations, offset) {
    const shiftedIndex = (index + offset) % 26;
    const subsLetter = permutations[shiftedIndex];
    const subIndex = subsLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    const finalIndex = (subIndex - offset + 26) % 26;

    return finalIndex;
}
