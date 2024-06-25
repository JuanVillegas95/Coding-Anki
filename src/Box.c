#include "box.h"
#include <GLFW/glfw3.h>

void box_draw(Box box) {
    glColor3f(1.0f, 1.0f, 1.0f);
    glBegin(GL_LINE_LOOP);
    glVertex2f(box.minX, box.minY);
    glVertex2f(box.maxX, box.minY);
    glVertex2f(box.maxX, box.maxY);
    glVertex2f(box.minX, box.maxY);
    glEnd();
}