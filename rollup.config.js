import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'


export default {
    input: 'src/main.js',
    output: {
        file: 'static/main.js',
        format: 'iife',
        name: 'bundle',
    },
    plugins: [
        resolve ( {
            main: true,
            browser: true
        } ),
        commonjs ()
    ]
}