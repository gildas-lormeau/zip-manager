#include "ymfm_opn.h"

#include <cstdint>
#include <cstdlib>

namespace {

constexpr uint32_t OUTPUT_FRAMES = 4096;
constexpr float OUTPUT_SCALE = 1.0f / 32768.0f;

class Interface : public ymfm::ymfm_interface {
public:
  uint8_t *rom[ymfm::ACCESS_CLASSES] = {};
  uint32_t romSize[ymfm::ACCESS_CLASSES] = {};

  uint8_t ymfm_external_read(ymfm::access_class type,
                             uint32_t address) override {
    return address < romSize[type] ? rom[type][address] : 0;
  }
};

class Chip {
public:
  virtual ~Chip() = default;
  virtual uint32_t sampleRate(uint32_t clock) = 0;
  virtual void write(uint32_t offset, uint8_t data) = 0;
  virtual void generate(float *output, uint32_t frames) = 0;
};

template <typename ChipType> class ChipImplementation : public Chip {
public:
  explicit ChipImplementation(ymfm::ymfm_interface &interface)
      : chip(interface) {
    chip.reset();
  }

  uint32_t sampleRate(uint32_t clock) override {
    return chip.sample_rate(clock);
  }

  void write(uint32_t offset, uint8_t data) override {
    chip.write(offset, data);
  }

  void generate(float *output, uint32_t frames) override {
    typename ChipType::output_data data;
    for (uint32_t frame = 0; frame < frames; frame++) {
      chip.generate(&data);
      *output++ = (data.data[0] + data.data[2]) * OUTPUT_SCALE;
      *output++ = (data.data[1] + data.data[2]) * OUTPUT_SCALE;
    }
  }

private:
  ChipType chip;
};

Interface *interface_ = nullptr;
Chip *chip_ = nullptr;
float output_[OUTPUT_FRAMES * 2];

} // namespace

extern "C" {

__attribute__((export_name("create"))) uint32_t vgm_create(uint32_t clock,
                                                           uint32_t variantB) {
  delete chip_;
  delete interface_;
  interface_ = new Interface();
  if (variantB) {
    chip_ = new ChipImplementation<ymfm::ym2610b>(*interface_);
  } else {
    chip_ = new ChipImplementation<ymfm::ym2610>(*interface_);
  }
  return chip_->sampleRate(clock);
}

__attribute__((export_name("allocate"))) uint8_t *vgm_allocate(uint32_t type,
                                                               uint32_t size) {
  if (type >= ymfm::ACCESS_CLASSES) {
    return nullptr;
  }
  free(interface_->rom[type]);
  interface_->rom[type] = static_cast<uint8_t *>(calloc(size, 1));
  interface_->romSize[type] = interface_->rom[type] ? size : 0;
  return interface_->rom[type];
}

__attribute__((export_name("write"))) void vgm_write(uint32_t port,
                                                     uint32_t address,
                                                     uint32_t value) {
  chip_->write(port * 2, address);
  chip_->write(port * 2 + 1, value);
}

__attribute__((export_name("output"))) float *vgm_output() { return output_; }

__attribute__((export_name("outputFrames"))) uint32_t vgm_output_frames() {
  return OUTPUT_FRAMES;
}

__attribute__((export_name("generate"))) void vgm_generate(uint32_t frames) {
  chip_->generate(output_, frames > OUTPUT_FRAMES ? OUTPUT_FRAMES : frames);
}
}
