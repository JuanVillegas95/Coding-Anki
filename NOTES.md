
# Having different components in different files is troblsome so i made a file to keep them separated

## Understanding the Roles of `Container` and `Wrapper` in Styled Components

1. **`Container`:**
   - **Role:** A `Container` is a parent element meant to hold a sequence of child elements and create a structured layout. It is generally responsible for the overall layout constraints, such as width, padding, and alignment of content within a defined space.
   - **Purpose:** The purpose of a `Container` is to provide a consistent framework or area where multiple components or elements can live together. It often dictates the layout flow (e.g., flexbox or grid) and how child elements are arranged within it.
   - **Common Usage:**
     - Define the maximum width of content.
     - Center the main content area.
     - Apply a responsive grid or flexbox layout.
     - Manage the spacing and margins between a set of related child elements.

2. **`Wrapper`:**
   - **Role:** A `Wrapper` is a parent element primarily meant for positioning. It doesn't define the structural layout of its children but rather wraps around them to apply specific positioning, alignment, or other styling properties like background colors or borders.
   - **Purpose:** The `Wrapper` is used to control how a single element or a group of elements is positioned relative to the surrounding content or viewport. It's less about layout and more about applying specific styles or positioning effects.
   - **Common Usage:**
     - Center an element on the page or within another component.
     - Apply relative or absolute positioning.
     - Provide a background or styling context for a specific section.
     - Create spacing or alignment effects for a group of elements.

### Key Differences

- **`Container`:** Defines the structure and layout of multiple child elements. Used for creating the main sections of your layout, such as a grid or a flexbox, where the arrangement of child elements is essential.
  
- **`Wrapper`:** Focuses on positioning and applying styles around elements without necessarily affecting the layout flow. Used for wrapping elements to apply styles like centering, background color, padding, or creating specific positioning contexts (relative, absolute).

### Practical Examples

1. **Using `Container` for Layout:**
   - Example: Creating a layout for a blog post where the `Container` defines the content width and structure.

2. **Using `Wrapper` for Positioning:**
   - Example: Creating a centered card component within the viewport.

### Conclusion

- Use **`Container`** when you are building the main layout structure of your application or components that involve a sequence of elements with defined positioning rules.
- Use **`Wrapper`** when you need to control the positioning of a specific element or a small group of elements relative to their surroundings.


So
x is true y show meanu
x is from true to false first (animation of Menu leaving) then set x to false [Here animation 0, x timeout]
if x false use effect on y set y true



MeanuAnimationIn MenuAnimationOut
Me

Render   Anim
0         0       
0         1       animaiton in -> change Render to 1 1.-
1         0 
1         1       animation out