shader_type canvas_item;

uniform float scale : hint_range(0, 100) = 1.0;

vec2 random(vec2 uv){
    uv = vec2( dot(uv, vec2(127.1,311.7) ),
               dot(uv, vec2(269.5,183.3) ) );
    return -1.0 + 2.0 * fract(sin(uv) * 43758.5453123);
}

float noise(vec2 uv) {
    vec2 uv_index = floor(uv);
    vec2 uv_fract = fract(uv);

    vec2 blur = smoothstep(0.0, 1.0, uv_fract);

    return mix( mix( dot( random(uv_index + vec2(0.0,0.0) ), uv_fract - vec2(0.0,0.0) ),
                     dot( random(uv_index + vec2(1.0,0.0) ), uv_fract - vec2(1.0,0.0) ), blur.x),
                mix( dot( random(uv_index + vec2(0.0,1.0) ), uv_fract - vec2(0.0,1.0) ),
                     dot( random(uv_index + vec2(1.0,1.0) ), uv_fract - vec2(1.0,1.0) ), blur.x), blur.y) + 0.5;
}

uniform float g = 32;

vec2 round2Digits(vec2 x, float nDigits) {
	float e = pow(10.0, nDigits);
	return round(x * e) / e;
}

vec2 quantize(vec2 x) {
	return vec2(1, 1);
}

void fragment() {
	vec2 ruv = round2Digits(UV / g, 2) + (vec2(1.0, 1.0) / g / 2.0);
	
	float sample = noise(ruv * scale);
	
	COLOR = vec4(sample, sample, sample, 1.0);
}
