#include "window.h"

#define HEIGHT 600
#define WIDTH 800
#define TITLE "Hello world!"

int main(int argc, const char** argv){
    Window* window = window_create(HEIGHT,WIDTH,TITLE);
    if(!window) return -1;
    
    window_loop(window);

    window_destroy(window);
    return 0;
}