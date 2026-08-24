# Public Dataset Notes

## Overview

Public speech-disfluency datasets exist and may appear useful for bootstrapping
the Mockly training set.  This document explains **why their labels should NOT
be treated as interview hesitation labels without careful review**.

---

## Datasets of Interest

### SEP-28k
- **Full name:** Stuttering Events in Podcasts — 28 000 clips
- **Source:** Lea et al., 2021 (Interspeech)
- **Labels:** Prolongation, Block, Sound repetition, Word repetition, Interjection  
- **Domain:** Podcast speech — conversational, not interview-specific

### UCLASS (University College London Archive of Stuttered Speech)
- **Labels:** Clinically annotated stuttering events  
- **Domain:** Clinical elicitation tasks

### FluencyBank
- **Labels:** Stuttering, disfluency, filled pauses in read/conversational speech  
- **Domain:** Mixed

---

## Why Public Labels ≠ Mockly Hesitation Labels

| Dimension | Public datasets | Mockly labels |
|---|---|---|
| **Domain** | Podcasts / clinical tasks | Simulated job interviews |
| **Label meaning** | Stuttering events / clinical categories | Communication fluency level (Low / Medium / High) |
| **Granularity** | Clip-level or word-level events | Per-answer holistic rating |
| **Audience** | Speech therapists / researchers | Hiring / self-improvement context |

Applying SEP-28k's "Word repetition" count directly as a `High` hesitation
label, for example, would be **incorrect** because:

1. A single repetition does not necessarily disrupt interview communication.  
2. The recording context (podcast vs. mock interview) differs entirely.  
3. The feature distribution may not match Mockly's audio pipeline.

---

## Safe Ways to Use Public Data

- **Feature inspiration only** — study which acoustic features correlate with
  disfluency in the literature, then compute your own features.
- **Pilot annotation reference** — use public clip examples to calibrate your
  own annotators' sense of what "High" hesitation sounds like.
- **Transfer learning baseline** — if and only if you re-annotate the clips
  using the Mockly label schema after listening to each clip.

---

## Decision for Mockly

> 🚫 Do NOT automatically import public dataset labels into `mockly_training.csv`.  
> ✅ Collect and label real Mockly recordings using human annotators.  
> ✅ Revisit public data only after 90+ labelled rows of real data exist.

---

## References

- Lea, C. et al. (2021). *SEP-28k: A Dataset for Stuttering Event Detection
  from Podcasts with People Who Stutter.* ICASSP 2021.
- FluencyBank: https://fluency.talkbank.org/
- UCLASS: https://www.uclass.psychol.ucl.ac.uk/
