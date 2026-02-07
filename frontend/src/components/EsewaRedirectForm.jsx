import { useEffect, useRef } from "react";

export default function EsewaRedirectForm({ formUrl, fields }) {
  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) formRef.current.submit();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h3>Redirecting to eSewa...</h3>
      <form ref={formRef} action={formUrl} method="POST">
        {Object.entries(fields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
