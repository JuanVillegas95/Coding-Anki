#include "window.h"
#include "particle.h"
#include "box.h"
#include <stdio.h>
#include <stdlib.h>
#include <GLFW/glfw3.h>

#define BOX_MARGIN 0.1f  
#define MAX_PARTICLES 100

struct Window {
    GLFWwindow* handle;
    Box box;
    Particle* particles[MAX_PARTICLES];
    int particle_count;
    int width;
    int height;
    char* title;
};

Window* window_create(int height, int width, char* title) {
    if (!glfwInit()) {
        fprintf(stderr, "Failed to initialize GLFW\n");
        return NULL;
    }

    GLFWwindow* handle = glfwCreateWindow(width, height, title, NULL, NULL);
    if (!handle) {
        fprintf(stderr, "Failed to create GLFW window\n");
        return NULL;
    }
    glfwMakeContextCurrent(handle);

    Window* window = (Window*)malloc(sizeof(Window));
    if (!window) {
        fprintf(stderr, "Failed to allocate memory for window structure\n");
        return NULL;
    }

    window->handle = handle;
    window->height = height;
    window->width = width;
    window->title = title;
    window->particle_count = 0;
    window->box = (Box){-1.0f + BOX_MARGIN, 1.0f - BOX_MARGIN, -1.0f + BOX_MARGIN, 1.0f - BOX_MARGIN};
    
    for (int i = 0; i < MAX_PARTICLES; ++i) {
        window->particles[i] = NULL;
    }

    return window;
}

void window_destroy(Window* window) {
    if (!window) return;

    for (int i = 0; i < MAX_PARTICLES; ++i) {
        if (window->particles[i]) {
            particle_destroy(window->particles[i]);
        }
    }

    glfwDestroyWindow(window->handle);
    free(window);
}


static void window_addParticle(Window* window) {
    if (window->particle_count >= MAX_PARTICLES) return;

    float r = (float)rand() / RAND_MAX;
    float g = (float)rand() / RAND_MAX;
    float b = (float)rand() / RAND_MAX;

    float x = window->box.minX + ((float)rand() / RAND_MAX) * (window->box.maxX - window->box.minX);
    float y = window->box.minY + ((float)rand() / RAND_MAX) * (window->box.maxY - window->box.minY);

    float vx = (float)rand() / RAND_MAX * 0.5f - 0.25f;
    float vy = (float)rand() / RAND_MAX * 0.5f - 0.25f;

    float radius = 0.02f + (float)rand() / RAND_MAX * 0.05f;

    window->particles[window->particle_count++] = particle_create(x, y, radius, r, g, b, vx, vy);
}

void window_loop(Window* window) {
    if (!window) return;

    double lastTime = glfwGetTime();

    while (!glfwWindowShouldClose(window->handle)) {
        glClear(GL_COLOR_BUFFER_BIT);

        double currentTime = glfwGetTime();
        double deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        box_draw(window->box);

        for (int i = 0; i < window->particle_count; ++i) {
            if (window->particles[i]) {
                particle_draw(window->particles[i]);
                particle_update(window->particles[i], deltaTime, window->box);
            }
        }

        if (window->particle_count < MAX_PARTICLES && rand() % 100 < 5) {
            window_addParticle(window);
        }

        glfwSwapBuffers(window->handle);
        glfwPollEvents();
    }
}
