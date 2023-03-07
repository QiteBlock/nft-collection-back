// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract Sample {
    // Entiers signés/non signés
    // Signé => négatif et positif 
    int256 signedInteger; 
    uint256 sampleUint; 
    uint64 smallerUint; // Sachant qu'on paye du gas pour chaque interraction avec la blockchain et plus l'espace des variables
                        // est minimisé plus le prix du gas est moins cher. Donc si on sait au préalable que la variable ne va pas dépasser
                        // une certaine valeur il vaut mieux stocker la variable dans un espace plus petit
    uint8 smallSmallUint;
    bool trueOrFalse;
    // ufixed / fixed c'est défini pour les nombres à virgule fixe mais pour le moment il n'est pas possible de les utiliser dans solidity 
    // Donc ça veut dire qu'il est pas possible d'avoir des nombre à virgule dans solidity pour le moment mais comme ça existe 
    // probablement dans des futurs version elles vont exister 
    address payable userOrContract; 
    bytes1 tableOf1Bytes; //...
    bytes32 tableOf32Bytes;
    // litéraux 
}