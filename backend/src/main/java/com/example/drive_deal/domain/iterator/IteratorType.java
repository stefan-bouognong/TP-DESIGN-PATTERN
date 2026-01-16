package com.example.drive_deal.domain.iterator;

public enum IteratorType {
    SEQUENTIAL,     // Parcours séquentiel simple
    FILTERED,       // Avec filtres
    PAGINATED,      // Paginé
    REVERSE,        // Ordre inverse
    PRICE_ASC,      // Tri par prix croissant
    PRICE_DESC,     // Tri par prix décroissant
    DATE_NEWEST,    // Plus récents d'abord
    DATE_OLDEST     // Plus anciens d'abord
}