"""Executable entry: paired checkpoint comparison.

Examples
--------
python compare_models.py
python compare_models.py --device cpu --dtype fp32
python compare_models.py --model-a Qwen/Qwen2.5-0.5B --model-b Qwen/Qwen2.5-1.5B --prompts prompts.txt
"""

from model_delta.harness import main

if __name__ == "__main__":
    main()
