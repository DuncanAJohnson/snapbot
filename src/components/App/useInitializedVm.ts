import { useEffect } from 'react';
// @ts-ignore
import defaultPatchProject from '../../assets/defaultProject.ptch1';
// @ts-ignore
import VirtualMachine from 'pyatch-vm';
// @ts-ignore
import Renderer from 'scratch-render';
// @ts-ignore
import AudioEngine from 'scratch-audio';
// @ts-ignore
import ScratchSVGRenderer from 'scratch-svg-renderer';
import makeTestStorage from "../../util/make-test-storage";
import usePatchStore from '../../store';
import { usePatchSerialization } from '../../hooks/usePatchSerialization';


const useInitializedVm = () => {
    const setPatchReady = usePatchStore(state => state.setPatchReady);
    const patchStage = usePatchStore(state => state.patchStage);
    const patchVM = usePatchStore(state => state.patchVM);
    const setPatchVM = usePatchStore(state => state.setPatchVM);
    const setQuestionAsked = usePatchStore(state => state.setQuestionAsked);
    const setVmLoaded = usePatchStore(state => state.setVmLoaded);
    const { loadSerializedProject, loadFromLocalStorage, hasLocalStorageProject } = usePatchSerialization();

    const loadProject = async () => {
      let loadSuccess = false;
      if (hasLocalStorageProject()) {
        loadSuccess = await loadFromLocalStorage();
      } 
      if (!loadSuccess) {
        await loadSerializedProject(defaultPatchProject);
      }
    }

    useEffect(() => {
        const asyncEffect = async () => {
          setPatchReady(false);

          const patchVM = new VirtualMachine();
          patchVM.attachStorage(makeTestStorage());
          const scratchRenderer = new Renderer(patchStage.canvas);
          patchVM.attachRenderer(scratchRenderer);
          patchVM.attachAudioEngine(new AudioEngine());
          patchVM.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
          
          patchVM.runtime.draw();
          patchVM.start();
          
          patchVM.on("VM READY", () => {
            setVmLoaded(true);
          });
          
          patchVM.runtime.on("QUESTION", onQuestionAsked);
          
          setPatchVM(patchVM);

        }
        asyncEffect();
    
      }, []);

    useEffect(() => {
      if (patchVM) {
        loadProject();
      }
    }, [patchVM]);
    
    const onQuestionAsked = (question: string | null) => {
        setQuestionAsked(question);
    }
}

export default useInitializedVm;