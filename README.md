# Entity_Component_System

This project is an in-browser, 2d platformer game I made with HTML, CSS, and JS. <a href="http://www.shealyntate.com/wp-content/uploads/2018/2d_platformer_game/game.html"> Try it out!</a> 

![ECS Demo](https://raw.githubusercontent.com/Shealynntate/Entity_Component_System/master/media/demo_images/WebPlatformerDemo1.gif)

All of the code, including the physics engine and the level editor are made from scratch in javascript. It's designed to let you play the game, switch to editor mode to make changes, and then resume game play immediately.<br>
I made this to better understand the fundamentals of game engine design and how to create basic level editing tools. I wanted it to run easily in a browser so anyone could play around with it and create a simple platforming level without any special programs or plugins. 

<h3>Entity Component System</h3>

The general design was implemented as an Entity Component System (<span class='project-link' onclick='window.location.href="http://gameprogrammingpatterns.com/component.html"'>ECS</span>), the general structure of which is as follows:

![Diagram](https://raw.githubusercontent.com/Shealynntate/Entity_Component_System/master/media/demo_images/ECS_Diagram.png)

A Manager class holds on to a list of entities active in the game. Each entity has a few simple data members, like a name, and 1 or more components. Components are ideally just <span class='project-link' onclick='window.location.href="https://en.wikipedia.org/wiki/Passive_data_structure"'>POD</span> containers without functionality. Each component holds data for a specific purpose. For example, every entity has a Transform component by default. This holds the entity's position, rotation, and scale values in 2 dimensional space.
When creating new entities in a scene, you can mix and match component types as necessary. For example, perhaps your level has a bunch of boxes your player can jump on and pickup. Then a Box entity will have Collider Component to register collisions with the player and other objects, a RigidBody Component to handle gravity and other forces applied to it, and a Sprite Component to render a box texture to the screen. Maybe you'll want some of the larger boxes to serve as walls in the level. Meaning the player will still collide with them, but they no longer respond to any forces in the game. We can simply remove the Rigidbody Component for those boxes. Perhaps you also want to add some secret boxes that are invisible, but when the player hits them they trigger a hidden passage to open up. For those, we can remove the Sprite Component and set the Collider to a trigger. That way the player won't actually bounce off the box collider, but instead trigger an event handler when intersecting it.

This approach of allowing different Entity types to pick and choose which components they'll have removes the needs for large, elaborate inheritance hierarchies that would need to account for every combination of components. Here it's easy to add a new feature via a new component type, and then simply add it to the entities that need it.

I mentioned that Components are meant to be POD, so what's causing all these actions - rendering, collisions, etc - to actually happen? That's where the systems come in. Each system is in charge of making a certain type of behavior happen. For example, the game has a Rendering System that draws textures to the screen. The ECS Manager holds on to a list of all the systems active in the game and calls update() on each every frame. Each system then loops over the list of entities and checks to see if they belong to the system. If it does, the system performs the update on it.

<h3>Level Editor</h3>

In Editor mode, there are some built-in tools to modify entities in the scene that are mapped to some hotkeys. There are also buttons to add, remove, and duplicate entities.
<ul>
<li> Q : panning tool to move around the scene</li>
<li> W : move tool for entities</li>
<li> E : rotate tool for entities</li>
<li> R : scale tool for entities</li>
</ul>

To the right of the game is the editor window. Here you can add, remove, and change entity components and render order, as well as alter global settings in the game.

![Inspector Window](https://raw.githubusercontent.com/Shealynntate/Entity_Component_System/master/media/demo_images/InspectorWindow.png) 
![Hierarchy Window](https://raw.githubusercontent.com/Shealynntate/Entity_Component_System/master/media/demo_images/HierarchyWindow.png) 

<h4>Inspector Window</h4>
Shows all the exposed data fields for all the components of the active entity. You can modify any of the data fields here for more precise control.

<h4>Hierarchy Window</h4>
Shows a listing of all the entities in the scene. Here you can change entity names and drag and drop them to change their rendering order (z-ordering goes from top to bottom).

<h4>Settings Window</h4>
Shows any global settings for the scene, such as the scale factor (pixels per unit) and the death line (the y-value at which the player automatically dies and respawns, e.g. when falling down a hole).

<h3>Gameplay Loop</h3>

 In play mode, you can use WASD keys to move the player and spacebar to jump. The central game loop function first checks the amount of time between frames and will wait for the target frame rate of 60fps. It then checks for player input and adds any detected moves as forces acting upon the player's rigidbody component. Any active rigidbodies then integrate using these forces and the time step for the current frame (making all physics frame rate independent). I used velocity Verlet integration for better stability. 

<h3>Collisions</h3>

Once the physics have been updated, the Collision System then checks for and resolves any collisions. Any entity with a collider component participates in this system. Every entity with a collider also has an Axis-Aligned Bounding Box (AABB). First the system checks to see if two AABBs overlap, which is a relatively computationally inexpensive check. If they don't, it moves on. If they do, then it process to run a collision check on the objects' actual colliders.<br>
If two entities with box colliders are involved, then the system uses the Separating Axis Theorem (SAT) to do the check. Basically, the idea is if you can draw a straight line with any slope between the two boxes and not touch either of them, then they aren't overlapping. It turns out that you don't need to test every conceivable line, just the normals from the colliders.

![Collision Diagram](https://raw.githubusercontent.com/Shealynntate/Entity_Component_System/master/media/demo_images/Collision_Diagram.png)

Using the four normals from the two box colliders, the system projects their collider corners onto each axis in turn and checks for overlapping min/max points. If there's no overlap on just one of the axes, then there's no collision. If there is a collision, then it finds the axis along which the two colliders have the smallest overlap. It then moves the entity with the rigidbody that amount along the axis to resolve the collision.

<h3>Save & Load</h3>
The editor saves your level design as a string object in window.localstorage. When a user clicks the save button, the ECS Manager calls the serialize() method on all its entities, which in turn calls serialize() on all its components. Each component assembles all its data into a list of key-value pairs and returns it as a string. The Entity then associates each one of those data strings with the component type name as one long string. Finally the manager collects the data strings from each entity and packs them together.

Loading user data works in reverse by calling deserialize() on the ECS manager and passing in the data string. Each Component of each entity parses the relevant section of the string back into meaning data fields.
