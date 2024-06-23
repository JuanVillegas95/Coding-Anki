#ifndef PARTICLE_H
#define PARTICLE_H

typedef struct Particle Particle;

Particle* particle_create(float x, float y, float radius, float r, float g, float b, float vx, float vy);
void particle_destroy(Particle* particle);
void particle_draw(Particle* particle);
void particle_update(Particle* particle, double deltaTime, float minX, float maxX, float minY, float maxY);

#endif // PARTICLE_H
