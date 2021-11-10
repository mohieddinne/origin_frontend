import { useEffect, useRef } from "react";

const useUpdateEffect = (effect, deps) => {
  const isInitialMount = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    isInitialMount.current
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps
  );
};

export default useUpdateEffect;
