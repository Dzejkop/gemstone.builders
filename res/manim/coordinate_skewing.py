from manim import *
import numpy as np

class SimplexNoiseSkewing(Scene):
    def construct(self):
        # Create title
        title = Text("Simplex Noise Coordinate Skewing", color=WHITE).scale(0.8).to_edge(UP)
        self.play(Write(title))

        # Create initial grid
        grid = NumberPlane(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            background_line_style={
                # "stroke_color": BLUE_E,
                # "stroke_width": 2,
                "stroke_opacity": 0.6
            },
            # axis_config={"color": BLUE}
        )

        self.play(Create(grid))

        # Skewing parameters
        F = (np.sqrt(3) - 1) / 2  # For 2D
        skew_matrix = np.array([[1 + F, F], [F, 1 + F]])

        # Create point at (1, 1)
        initial_coords = (1, 1)
        point = Dot(color=RED).move_to(grid.c2p(*initial_coords))
        point_label = MathTex("(x, y)", color=WHITE).next_to(point, UR, buff=0.2)
        self.play(Create(point), Write(point_label))

        # Formula
        formula = VGroup(
            MathTex(r"F = \frac{\sqrt{n+1}-1}{n}", color=WHITE),
            MathTex(r"x' = x + (x + y) \cdot F", color=WHITE),
            MathTex(r"y' = y + (x + y) \cdot F", color=WHITE)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.5).scale(0.8).to_edge(LEFT).shift(UP)
        self.play(Write(formula))

        # Define skew function
        def skew_func(coords):
            x, y = coords
            skewed_x = x + (x + y) * F
            skewed_y = y + (x + y) * F
            return (skewed_x, skewed_y)

        # Animate skewing
        skewed_coords = skew_func(initial_coords)
        self.play(
            grid.animate.apply_matrix(skew_matrix),
            point.animate.move_to(grid.c2p(*skewed_coords)),
            UpdateFromFunc(point_label, lambda m: m.next_to(point, UR, buff=0.2)),
            run_time=3
        )

        # Final labels
        skewed_label = MathTex("(x', y')", color=WHITE).next_to(point, UR, buff=0.2)
        self.play(Transform(point_label, skewed_label))

        # Add explanation
        explanation = Text(
            "The grid and point are skewed using the same function,\n"
            "transforming (x, y) to (x', y')",
            font_size=24,
            color=WHITE
        ).next_to(grid, DOWN)
        self.play(Write(explanation))

        self.wait(2)

if __name__ == "__main__":
    scene = SimplexNoiseSkewing()
    scene.render()