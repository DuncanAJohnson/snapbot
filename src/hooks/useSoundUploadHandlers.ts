import { handleFileUpload, soundUpload } from '../lib/file-uploader';
import usePatchStore from '../store';
import { Sound, SoundJson } from '../components/EditorPane/types';

export const useSoundHandlers = () => {
    const patchVM = usePatchStore(state => state.patchVM);
    const addSound = usePatchStore(state => state.addSound);

    const handleUploadSound = (targetId: string) => {
        //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';

        const result = new Promise<void>((resolve, reject) => {
            input.onchange = (e: any) => {
            handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
                soundUpload(buffer, fileType, patchVM.runtime.storage, async vmSound => {
                    if (targetId == undefined || targetId == null) {
                        await addSound({...vmSound, name: fileName });
                    } else {
                        await addSound({...vmSound, name: fileName }, targetId);
                    }

                    resolve();
                }, console.log);
            }, console.log);
            }

            input.onabort = () => {
            resolve();
            }
        }
        );

        console.warn("Clicking input");
        

        input.click();

        return result;
    };

    const handleAddSoundToEditingTarget = (sound: Sound | SoundJson, fromLibrary: boolean) => {
        console.log("Adding sound to editing target", sound, fromLibrary);
        addSound(fromLibrary ? {...sound, md5: sound.md5ext} : sound);
    }

    return {
        handleUploadSound,
        handleAddSoundToEditingTarget,
    }
}