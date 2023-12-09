import os
import shutil
import time
from glob import glob

from constants import TYPES


def translate_watcher(input_directory, output_directory):
    print("Starting to watch {input_directory} and export to {output_directory}".format(input_directory=input_directory,
                                                                                        output_directory=output_directory))
    try:
        while True:
            files = [n for n in glob(input_directory + "/*") if os.path.isfile(n) and os.path.splitext(n)[1] in TYPES]

            if len(files) > 0:
                file = files[0]

                wait_for_file_copied(file)

                file_without_language = file.replace('.en', '')
                print("Remove .en")
                os.rename(file, file_without_language)

                print("Translate {file}".format(file=file_without_language))
                os.system("subtrans translate \"{file}\" --src en --dest fr".format(file=file_without_language))

                file_name = os.path.splitext(file_without_language)[0]
                print("Copy file {file_name}.fr.srt to {output}".format(file_name=file_name, output=output_directory))
                shutil.move("{file_name}.fr.srt".format(file_name=file_name), output_directory)

                print("Remove {file}".format(file=file_without_language))
                os.remove(file_without_language)

            time.sleep(5)
    except KeyboardInterrupt:
        print('Interrupt by user')


def wait_for_file_copied(file):
    print("Wait for file {file} to be copied".format(file=file))

    wait_time = 10

    time.sleep(wait_time)
    copy_finished = False

    while not copy_finished:
        size = os.stat(file).st_size

        if size == os.stat(file).st_size:
            print("Copy {file} finished".format(file=file))
            copy_finished = True
        else:
            print("Copy still in progress")

        wait_time = wait_time + 5
        time.sleep(5)