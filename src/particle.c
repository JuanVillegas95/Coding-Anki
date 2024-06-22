#include "particle.h"
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <GLFW/glfw3.h>

#define PI 3.1416
#define STEPS 100

struct Particle {
    float x, y;
    float radius;
    float r, g, b;
    float vx, vy;  
};


Particle* particle_create(float x, float y, float radius, float r, float g, float b, float vx, float vy) {
    Particle* particle = (Particle*)malloc(sizeof(Particle));
    if (!particle) return NULL;

    particle->x = x;
    particle->y = y;
    particle->radius = radius;
    particle->r = r;
    particle->g = g;
    particle->b = b;
    particle->vx = vx;
    particle->vy = vy;

    return particle;
}


void particle_destroy(Particle* particle){
  if(!particle) return;
  free(particle);
}

void particle_draw(Particle* particle){
  if(!particle) return;

  glColor3f(particle->r,particle->g,particle->b);
  glBegin(GL_TRIANGLE_FAN);
  glVertex2f(particle->x,particle->y);

  for(int i = 0; i<=STEPS; i++){
    float angle = i * ( PI * 2.0f ) / STEPS;
    glVertex2f(
      particle->x + cos(angle) * particle->radius,
      particle->y + sin(angle) * particle->radius
    );
  }

  glEnd();
}

void particle_update_position(Particle* particle) {
    if (!particle) return;
    particle->x += particle->vx;
    particle->y += particle->vy;
}
