#include "window.h"
#include "particle.h"
#include "box.h"
#include <stdio.h>
#include <stdlib.h>
#include <GLFW/glfw3.h>
#include <GLUT/glut.h>

#define BOX_MARGIN 0.125f  
#define MAX_PARTICLES 10000

struct Window {
    GLFWwindow* handle;
    Box box;
    Particle* particles[MAX_PARTICLES];
    int particle_count;
    int width;
    int height;
    char* title;
};

Window* window_create(int height, int width, char* title){
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
    glfwSwapInterval(0);
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

static float randomNumber(void) {
    return (float)rand() / RAND_MAX;
}

static void addParticle(Window* window, double* mouseX, double* mouseY) {
    if (window->particle_count >= MAX_PARTICLES) return;

    float r = randomNumber();
    float g = randomNumber();
    float b = randomNumber();

    float x, y;
    if (mouseX && mouseY) {
        x = (float)(*mouseX / window->width * 2.0 - 1.0);
        y = (float)(1.0 - *mouseY / window->height * 2.0);
    } else {
        x = window->box.minX + randomNumber() * (window->box.maxX - window->box.minX);
        y = window->box.minY + randomNumber() * (window->box.maxY - window->box.minY);
    }

    float vx = randomNumber() * 0.5f - 0.25f;
    float vy = randomNumber() * 0.5f - 0.25f;

    float radius = 0.02f + randomNumber() * 0.05f;

    window->particles[window->particle_count++] = particle_create(x, y, radius, r, g, b, vx, vy);
}

void renderText(float x, float y, const char* text) {
    glRasterPos2f(x, y);
    while (*text) {
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, *text);
        text++;
    }
}

double calculateFPS(double deltaTime) {
    static double frames = 0;
    static double fps = 0;
    static double lastTime = 0;

    frames++;
    double currentTime = glfwGetTime();
    if (currentTime - lastTime >= 1.0) {
        fps = frames / (currentTime - lastTime);
        lastTime = currentTime;
        frames = 0;
    }

    return fps;
}

void window_loop(Window* window) {
    if (!window) return;

    double lastTime = glfwGetTime();

    while (!glfwWindowShouldClose(window->handle)) {
        glClear(GL_COLOR_BUFFER_BIT);

        double currentTime = glfwGetTime();
        double deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        double fps = calculateFPS(deltaTime);

        box_draw(window->box);

        for (int i = 0; i < window->particle_count; ++i) {
            if (window->particles[i]) {
                particle_draw(window->particles[i]);
                particle_update(window->particles[i], deltaTime, window->box);
            }
        }

        if (glfwGetMouseButton(window->handle, GLFW_MOUSE_BUTTON_LEFT) == GLFW_PRESS) {
            double mouseX, mouseY;
            glfwGetCursorPos(window->handle, &mouseX, &mouseY);
            addParticle(window, &mouseX, &mouseY);
        }
        // Uncomment this line if you want to add particles randomly over time
        // if (rand() % 100 < 5) addParticle(window, NULL, NULL);

        // Convert particle count to string and render it
        char particleCountText[50];
        sprintf(particleCountText, "Particles: %d", window->particle_count);
        renderText(-0.95f, 0.9f, particleCountText); // Adjust position as needed

        // Render FPS
        char fpsText[50];
        sprintf(fpsText, "FPS: %.2f", fps);
        renderText(0.7f, 0.9f, fpsText); // Adjust position as needed

        glfwSwapBuffers(window->handle);
        glfwPollEvents();
    }
}
