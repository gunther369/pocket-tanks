# Pocket Tanks

A browser-based artillery duel inspired by the classic Pocket Tanks game. Two players (or one player vs CPU) take turns lobbing projectiles across destructible terrain, competing for the highest score over 10 rounds.

## Live demo (GitHub Pages)

After you push this repo to GitHub:

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. The **Deploy GitHub Pages** workflow runs on every push to `main`. Open the workflow run to copy the deployment URL, or use:

   `https://<your-username>.github.io/<repository-name>/`

   Example: `https://octocat.github.io/pocket-tanks/`

The game uses relative asset paths (`index.html`, `game.js`, `style.css`), so it works both locally and under a `/repository-name/` base path on Pages.

## How to Play

Open `index.html` in any modern browser — no build step or server required. For the hosted demo, open the Pages URL above.

### Start Screen

1. Choose **2 Players** or **vs CPU**.
2. Enter player names (optional) and press **Start**.

### Controls

| Action | Keyboard | UI |
|--------|----------|----|
| Adjust angle | `←` / `→` | Angle **◄ ►** buttons |
| Adjust power | `↑` / `↓` | Power **▲ ▼** buttons |
| Cycle weapon | `Q` / `E` | Weapon dropdown |
| Move tank | `A` / `D` | Move **◄ ►** buttons |
| Fire | `Space` | **FIRE** button |

### Rules

- **10 rounds** — each player fires once per round (20 shots total).
- **Score-based** — damage dealt to your opponent becomes your points. Highest score wins.
- **One-use weapons** — each weapon can only be fired once per game. Choose wisely.
- **5 moves per game** — each move slides your tank along the terrain. Use them to dodge or reposition.
- **Wind** — changes every turn and pushes projectiles sideways.
- **360-degree barrel** — aim in any direction.
- **Destructible terrain** — explosions carve craters, altering the battlefield.

## Weapons

30 unique weapons with different behaviours:

| Category | Examples |
|----------|---------|
| Standard | Single Shot, Big Shot, Sniper Rifle |
| Multi-shot | 3 Shot, 5 Shot, Scatter Shot, Carpet Bomb, Hail Storm, Tommy Gun, Dive Bomb |
| Homing | Heatseeker, Homing Missile |
| Bouncing | Cannon Ball, Skipper, Fireball |
| Splitting | Crazy Ivan, Fission Bomb, Pineapple |
| Chain | Firecracker, Chain Reaction, Mega Reaction |
| Area / Special | Napalm, Nuke, Mass Driver, Cruiser, Bunker Buster |
| Terrain | Dirt Mover, Crater Maker, Digger |

## Features

- **Procedural terrain** with layered textures, grass tufts, rocks, and strata
- **Parallax background** — stars, mountains, animated clouds, and bats
- **Particle effects** — explosions, muzzle flash, smoke, floating score text
- **Synthesised audio** via Web Audio API (fire and explosion sounds)
- **CPU opponent** with basic aiming AI
- **Responsive layout** — fits the browser window without scrolling

## Tech Stack

- Vanilla JavaScript (single `game.js`, no frameworks)
- HTML5 Canvas for rendering
- CSS3 with glassmorphism UI and custom fonts (Orbitron, Rajdhani)
- Web Audio API for sound effects

## Project Structure

```
pocket-tanks/
├── index.html   — page structure and UI elements
├── style.css    — all styling and layout
├── game.js      — game logic, rendering, physics, AI
└── README.md
```
