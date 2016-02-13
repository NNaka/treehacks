#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "pnmrdr.h"
#include "uarray2.h"

#define BOX_WIDTH 3
#define LINE_LENGTH 9
#define LINE_SUM 45
#define T UArray2_T

void check_sudoku(FILE *fp);
void read_sudoku(T *uarray2, int x, int y, void *cl1, void *cl2);
void check_row(T *uarray2, int x, int y, void *cl1, void *cl2);
void check_box(T *uarray2, int x, int y, void *cl1, void *cl2);

void check_sudoku(FILE *fp) {
    Pnmrdr_T pnmrdr;
    TRY {
        pnmrdr = Pnmrdr_new(fp);
    }
    EXCEPT(Pnmrdr_Badformat) {
        Except_raise(&Pnmrdr_Badformat, "sudoku.c", 21);
        fclose(fp);
        exit(EXIT_FAILURE);
    }
    END_TRY;

    Pnmrdr_mapdata sudoku = Pnmrdr_data(pnmrdr);
    if(sudoku.type != Pnmrdr_gray) {
        Pnmrdr_free(&pnmrdr);
        if (fp != stdin) { 
            fclose(fp); 
        } 
    } 
    assert(sudoku.type == Pnmrdr_gray);
    if (sudoku.width != LINE_LENGTH || sudoku.height != LINE_LENGTH || sudoku.denominator != LINE_LENGTH) {
        Pnmrdr_free(&pnmrdr);
        if (fp != stdin) { 
            fclose(fp);
        }
        exit(1); 
    }
    T *uarray2 = UArray2_new(LINE_LENGTH, LINE_LENGTH, sizeof(int));
    assert(uarray2);
    
    int i, j, *temp;
    for (i = 0; i < LINE_LENGTH; ++i) {
        for (j = 0; j < LINE_LENGTH; ++j) {
            temp = UArray2_at(uarray2, i, j); 
            *temp = (int)Pnmrdr_get(pnmrdr);
        }
    }
    //UArray2_map_row_major(uarray2, read_sudoku, &pnmrdr);

    Pnmrdr_free(&pnmrdr);

    UArray2_map_row_major(uarray2, check_row, NULL);
    UArray2_map_col_major(uarray2, check_row, NULL);
    UArray2_map_col_major(uarray2, check_box, NULL);

    UArray2_free(&uarray2);
}

int main(int argc, char* argv[]) {
    FILE *fp = stdin;
    if (argc > 2) exit(EXIT_FAILURE); // no files submitted

    if (argc == 2) {
        fp = fopen(argv[1], "rb");
        if (fp == NULL) {
	        exit(EXIT_FAILURE);
        }
    }

    check_sudoku(fp);

    fclose(fp);

    return 0;
}

void read_sudoku(T *uarray2, int x, int y, void *cl1, void *cl2) {
    (void) cl2;
    int *temp;
    temp = UArray2_at(uarray2, x, y);
    *temp = (int)Pnmrdr_get(cl1);
}

void check_row(T *uarray2, int x, int y, void *cl1, void *cl2) {
    (void) cl1;
    (void) cl2;
    int *value = UArray2_at(uarray2, x, y), *temp;
    unsigned int row;
    for (row = 0; row < LINE_LENGTH; ++row) {
        temp = UArray2_at(uarray2, row, y);
        if (*value == *temp && x != (int)row) {
            //free(sum);
            UArray2_free(&uarray2);
            exit(1); 
        }
    }
}

void check_box(T *uarray2, int x, int y, void *cl1, void *cl2) {
    (void) cl1;
    (void) cl2;
    int *value = UArray2_at(uarray2, x, y), *temp;
    int row_group = x / BOX_WIDTH, col_group = y / BOX_WIDTH, row, col, real_row, real_col;

    for(row = 0; row < BOX_WIDTH; row++) {
        for(col = 0; col < BOX_WIDTH; col++) {
            real_row = row + row_group * BOX_WIDTH;
            real_col = col + col_group * BOX_WIDTH;
            temp = UArray2_at(uarray2, real_row, real_col);
            if (*value == *temp && x != real_row && y != real_col) {
                //free(cl1);
                UArray2_free(&uarray2);
                exit(1); 
            }
        }
    }
}

#undef BOX_WIDTH
#undef LINE_LENGTH
#undef LINE_SUM
#undef T
