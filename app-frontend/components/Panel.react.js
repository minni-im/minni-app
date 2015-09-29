export default function Panel({title, description, actions = [], sidebar=false, content}) {
  let actions = false;
  if (actions.length) {
    actions = <div className="header-actions">{actions}</div>;
  }

  return <main>
    <header>
      <div className="info">
        <h2>{title}</h2>
        <h3>{description}</h3>
      </div>
      {actions}
    </header>
    {sidebar ? sidebar : false}
    <section className="panel">
      {content}
    </section>
  </main>;
}
