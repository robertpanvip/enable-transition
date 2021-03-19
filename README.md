📦 **Installation**
``` javascript
npm install enable-transition
```
🔨 **Usage**
``` javascript
class Test extends React.PureComponent {

    state = {
        num: 2,
        visible: false,
        display: 'none',
        height: 100
    };

    onToggle = () => this.setState({num: (this.state.num + 1) % 2});

    onToggle2 = () => this.setState(({visible}: any) => ({visible: !visible}));

    onToggle3 = () => this.setState(({display}: any) => ({display: display === 'block' ? 'none' : 'block'}));

    onToggle4 = () => this.setState(({height}: any) => ({height: height === 100 ? undefined : 100}));

    render() {
        const {num, visible, display, height} = this.state;
        return (
            <div>
                1、style切换-高度切换
                <div className={'container'}>
                    <EnableTransition attribute={'height'}  >
                        {(ref: React.LegacyRef<HTMLDivElement>) => {
                            return <div
                                ref={ref}
                                style={{
                                    width: 100,
                                    transition: 'all 500ms',
                                    height: height,
                                    backgroundColor: 'red'
                                }}
                            >高度切换
                            </div>
                        }}
                    </EnableTransition>
                    <button onClick={this.onToggle4}>toggle</button>
                </div>
                2、style切换-display切换
                <div className={'container'}>
                    <EnableTransition attribute={'display'} displayNone={{setHeightZero:true,setWidthZero:true}}>
                        {(ref: React.LegacyRef<HTMLDivElement>) => {
                            return <div
                                ref={ref}
                                style={{
                                    width: 100,
                                    height:100,
                                    transition: 'all 5000ms',
                                    display: display,
                                    backgroundColor: 'red'
                                }}
                            >高度切换
                            </div>
                        }}
                    </EnableTransition>
                    <button onClick={this.onToggle3}>toggle</button>
                </div>
            </div>
        );
    }
}
```
