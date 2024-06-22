#ifndef WINDOW_H
#define WINDOW_H

#include <GLFW/glfw3.h>

typedef struct Window Window;

Window* window_create(int height, int width, char* title);
void window_destroy(Window* window);
void window_loop(Window* window);

#endif // WINDOW_H