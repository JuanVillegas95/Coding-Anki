#include "window.h"
#include "particle.h"
#include <stdio.h>
#include <stdlib.h>

struct Window {
    GLFWwindow* handle;
    int width;
    int height;
    char* title;
};

Window* window_create(int height, int width, char* title){
    if(!glfwInit()) {
        fprintf(stderr, "Failed to initialize GLFW\n");
        return NULL;
    }

    GLFWwindow* handle = glfwCreateWindow(width, height, title, NULL, NULL);
    if(!handle) {
        fprintf(stderr, "Failed to initialize GLFWwindow\n");
        return NULL;
    }
    glfwMakeContextCurrent(handle);

    Window* window = (Window*)malloc(sizeof(Window));
    if(!window) {
        fprintf(stderr, "Failed to initialize window structure\n");
        return NULL;
    }

    window->handle = handle;
    window->height = height;
    window->width = width;
    window->title = title;

    return window;
}

void window_destroy(Window* window){
    if(!window) return;

    window->height = 0;
    window->width = 0;
    glfwDestroyWindow(window->handle);
    free(window);
}

void window_loop(Window* window) {
    if (!window) return;

    double lastTime = glfwGetTime();
    Particle* particle = particle_create(0.0f, 0.0f, 0.1f, 1.0f, 0.0f, 0.0f, 0.01f, 0.01f);
    while (!glfwWindowShouldClose(window->handle)) {
        glClear(GL_COLOR_BUFFER_BIT);

        double currentTime = glfwGetTime();
        double deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        particle_updatePosition(particle, deltaTime);
        particle_draw(particle);

        glfwSwapBuffers(window->handle);
        glfwPollEvents();
    }

    particle_destroy(particle);
}
