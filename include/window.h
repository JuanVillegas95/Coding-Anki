#ifndef WINDOW_H
#define WINDOW_H

#include <GLFW/glfw3.h>

typedef struct Window Window;

Window* window_create(int _height, int _width, char* _title);
void window_destroy(Window* _window);
void window_loop(Window* _window);

#endif // WINDOW_H