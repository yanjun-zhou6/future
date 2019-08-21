import React, {PureComponent} from 'react'
import Link from 'react-router-dom';

export default class Header extends PureComponent {
    render(){
        return (
            <div class="header" id="header">
                <ul>
                    <li><Link></Link>首页</li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        )
    }
}