As I've been working on a refactor to my solitaire game I've encountered issues with organizing and managing large blocks of conditional logic. 

The solitaire game is keyboard driven and stores a highlight state. When the user presses up, down, left, or right on the keyboard, the game uses fairly complex conditional logic to determine which card should next be selected. The question is, how can this complexity be simplified?

Current technologies I'm vaguely aware of:

State machines / state