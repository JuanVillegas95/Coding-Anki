Convetnions i did
C stants fort constants
F for functions
S for styles

Having different components in different files is troblsome so i made a file to keep them separated
There is only one file for page meaning all the components in one file



Considerations i took with the app.
Logic with the Calendar app in order for this to not be an offensive constant of rerendering and updating variabels

There is a object Calendar that is a map of caledar, then each calendar has a map of event.
So in order to update an event I need a copy of all the previous calendars and set it in Calendars I find that offensive because it's jnust an operaiton foc reating an event therefore, I thoutgth to myself to have an state of current Event and Current Calendar and when this is clicked on the buitton save to update the satte of calnedars to have a betetr control and user expirience performance.