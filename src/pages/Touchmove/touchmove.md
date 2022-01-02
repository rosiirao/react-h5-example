# Touch to move card issues

## The touch event is not fired on some elements on iOS

When scroll down, the touch events on the elements at the bottom of the page may be not fired. The reason it the page is visible at the overflow zones of its ancestor.

Make its ancestor height auto to make the touch events works on all elements.

## Solutions to draw card when moving

### Make container position invariant

- The container position is invariant
- Draw the contents to different containers
- When draw new card, add new containers first and then draw contents

### Make an interim shadow card

- Make an fixed interim shadow card stand at the original position
- Make moving card hidden, and transform the interim card
- When resort the card, the fixed positioned card always has an fixed original position
