#ifndef BOX_H
#define BOX_H

typedef struct Box {
    float minX;
    float maxX;
    float minY;
    float maxY;
} Box;

void box_draw(Box box);


#endif // BOX_H
