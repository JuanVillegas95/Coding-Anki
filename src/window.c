#include "window.h"
#include "particle.h" // Include the particle header
#include <stdio.h>
#include <stdlib.h>

struct Window {
    GLFWwindow* handle;
    int width;
    int height;
    char* title;
};

Window* window_create(int _height, int _width, char* _title){
    if(!glfwInit()) {
        fprintf(stderr, "Failed to initialize GLFW\n");
        return NULL;
    }

    GLFWwindow* _handle = glfwCreateWindow(_width, _height, _title, NULL, NULL);
    if(!_handle) {
        fprintf(stderr, "Failed to initialize GLFWwindow\n");
        return NULL;
    }
    glfwMakeContextCurrent(_handle);

    Window* _window = (Window*)malloc(sizeof(Window));
    if(!_window) {
        fprintf(stderr, "Failed to initialize window structure\n");
        return NULL;
    }

    _window->handle = _handle;
    _window->height = _height;
    _window->width = _width;
    _window->title = _title;

    return _window;
}

void window_destroy(Window* _window){
    if(!_window) return;

    _window->height = 0;
    _window->width = 0;
    glfwDestroyWindow(_window->handle);
    free(_window);
}

void window_loop(Window* _window){
    if(!_window) return;

    Particle* particle = create_particle(0.0f, 0.0f, 0.1f, 1.0f, 0.0f, 0.0f);

    while(!glfwWindowShouldClose(_window->handle)){
        glClear(GL_COLOR_BUFFER_BIT);

        draw_particle(particle);

        glfwSwapBuffers(_window->handle);
        glfwPollEvents();
    }

    destroy_particle(particle);
}
