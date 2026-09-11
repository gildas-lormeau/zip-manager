#include "tfmxaudiodecoder.h"

#include <cstdint>
#include <cstdlib>

namespace {

constexpr uint32_t OUTPUT_FRAMES = 4096;
constexpr int BITS_PER_SAMPLE = 16;
constexpr int CHANNELS = 2;
constexpr int SILENCE = 0;
constexpr float OUTPUT_SCALE = 1.0f / 32768.0f;

void *decoder_ = nullptr;
int16_t pcm_[OUTPUT_FRAMES * CHANNELS];
float output_[OUTPUT_FRAMES * CHANNELS];
uint8_t *module_ = nullptr;

} // namespace

extern "C" {

__attribute__((export_name("create"))) void tfmx_create(uint32_t rate,
                                                        uint32_t panning) {
  if (decoder_) {
    tfmxdec_delete(decoder_);
  }
  decoder_ = tfmxdec_new();
  tfmxdec_mixer_init(decoder_, rate, BITS_PER_SAMPLE, CHANNELS, SILENCE,
                     panning);
  tfmxdec_set_loop_mode(decoder_, 1);
}

__attribute__((export_name("allocate"))) uint8_t *tfmx_allocate(uint32_t size) {
  free(module_);
  module_ = static_cast<uint8_t *>(malloc(size));
  return module_;
}

__attribute__((export_name("load"))) uint32_t tfmx_load(uint32_t size,
                                                        uint32_t song) {
  return tfmxdec_init(decoder_, module_, size, song);
}

__attribute__((export_name("songs"))) uint32_t tfmx_songs() {
  return tfmxdec_songs(decoder_);
}

__attribute__((export_name("duration"))) uint32_t tfmx_duration() {
  return tfmxdec_duration(decoder_);
}

__attribute__((export_name("output"))) float *tfmx_output() { return output_; }

__attribute__((export_name("outputFrames"))) uint32_t tfmx_output_frames() {
  return OUTPUT_FRAMES;
}

__attribute__((export_name("generate"))) void tfmx_generate(uint32_t frames) {
  if (frames > OUTPUT_FRAMES) {
    frames = OUTPUT_FRAMES;
  }
  tfmxdec_buffer_fill(decoder_, pcm_, frames * CHANNELS * sizeof(int16_t));
  for (uint32_t index = 0; index < frames * CHANNELS; index++) {
    output_[index] = pcm_[index] * OUTPUT_SCALE;
  }
}
}
