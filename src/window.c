#include "window.h"
#include "particle.h"
#include <stdio.h>
#include <stdlib.h>
#include <GLFW/glfw3.h>

#define BOX_MARGIN 0.1f  // Margin for the box boundaries

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

void draw_box(float minX, float maxX, float minY, float maxY) {
    glColor3f(1.0f, 1.0f, 1.0f); // White color for the box
    glBegin(GL_LINE_LOOP);
    glVertex2f(minX, minY);
    glVertex2f(maxX, minY);
    glVertex2f(maxX, maxY);
    glVertex2f(minX, maxY);
    glEnd();
}

void window_loop(Window* window) {
    if (!window) return;

    Particle* particle = particle_create(0.0f, 0.0f, 0.05f, 1.0f, 0.0f, 0.0f, 0.2f, 0.2f);

    float minX = -1.0f + BOX_MARGIN;
    float maxX = 1.0f - BOX_MARGIN;
    float minY = -1.0f + BOX_MARGIN;
    float maxY = 1.0f - BOX_MARGIN;

    double lastTime = glfwGetTime();
    while (!glfwWindowShouldClose(window->handle)) {
        glClear(GL_COLOR_BUFFER_BIT);

        double currentTime = glfwGetTime();
        double deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        particle_update(particle, deltaTime, minX, maxX, minY, maxY);
        particle_draw(particle);
        draw_box(minX, maxX, minY, maxY);

        glfwSwapBuffers(window->handle);
        glfwPollEvents();
    }

    particle_destroy(particle);
}