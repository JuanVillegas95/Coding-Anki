#include "window.h"
#include "particle.h"
#include <stdio.h>
#include <stdlib.h>
#include <GLFW/glfw3.h>

#define BOX_MARGIN 0.1f  
#define MAX_PARTICLES 100

struct Window {
    GLFWwindow* handle;
    int width;
    int height;
    char* title;
    Particle* particles[MAX_PARTICLES];
    int particle_count;
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
    window->particle_count = 0;

    for (int i = 0; i < MAX_PARTICLES; ++i) {
        window->particles[i] = NULL;
    }

    return window;
}

void window_destroy(Window* window){
    if(!window) return;

    for (int i = 0; i < MAX_PARTICLES; ++i) {
        if (window->particles[i]) {
            particle_destroy(window->particles[i]);
        }
    }

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

void add_particle(Window* window) {
    if (window->particle_count >= MAX_PARTICLES) return;

    float minX = -0.9f;
    float maxX = 0.9f;
    float minY = -0.9f;
    float maxY = 0.9f;

    float x = minX + ((float)rand() / RAND_MAX) * (maxX - minX);
    float y = minY + ((float)rand() / RAND_MAX) * (maxY - minY);
    float radius = 0.02f + (float)rand() / RAND_MAX * 0.05f;
    float r = (float)rand() / RAND_MAX;
    float g = (float)rand() / RAND_MAX;
    float b = (float)rand() / RAND_MAX;
    float vx = (float)rand() / RAND_MAX * 0.5f - 0.25f;
    float vy = (float)rand() / RAND_MAX * 0.5f - 0.25f;

    window->particles[window->particle_count++] = particle_create(x, y, radius, r, g, b, vx, vy);
}


void window_loop(Window* window) {
    if (!window) return;

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

        for (int i = 0; i < window->particle_count; ++i) {
            if (window->particles[i]) {
                particle_update(window->particles[i], deltaTime, minX, maxX, minY, maxY);
                particle_draw(window->particles[i]);
            }
        }

        draw_box(minX, maxX, minY, maxY);

        if (window->particle_count < MAX_PARTICLES && rand() % 100 < 5) {
            add_particle(window);
        }

        glfwSwapBuffers(window->handle);
        glfwPollEvents();
    }
}
