import sys

from process import translate_watcher

if __name__ == '__main__':
    if len(sys.argv) == 3:
        [_, input_directory, output_directory] = sys.argv
        translate_watcher(input_directory=input_directory, output_directory=output_directory)
    else:
        print("Need directories parameters")
