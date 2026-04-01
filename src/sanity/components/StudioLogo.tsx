export function StudioLogo(props: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        backgroundColor: '#e11d48', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px',
        fontFamily: 'serif'
      }}>
        A
      </div>
      <span style={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'serif' }}>Arthanomy</span>
    </div>
  );
}
