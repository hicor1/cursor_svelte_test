<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import TextAlign from '@tiptap/extension-text-align';
	import Underline from '@tiptap/extension-underline';
	import TextStyle from '@tiptap/extension-text-style';
	import Color from '@tiptap/extension-color';
	import Highlight from '@tiptap/extension-highlight';
	import Table from '@tiptap/extension-table';
	import TableRow from '@tiptap/extension-table-row';
	import TableCell from '@tiptap/extension-table-cell';
	import TableHeader from '@tiptap/extension-table-header';
	import CodeBlock from '@tiptap/extension-code-block';
	import type { Level } from '@tiptap/extension-heading';

	// 에디터 컨텐츠 바인딩을 위한 프롭
	export let content = '';
	
	// 에디터 인스턴스
	let element: HTMLElement;
	let editor: Editor;
	
	// 색상 팔레트
	const colors = [
		'#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
		'#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
		'#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
	];
	
	// 에디터 생성
	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Image,
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						target: '_blank',
						rel: 'noopener noreferrer'
					}
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Underline,
				TextStyle,
				Color,
				Highlight.configure({
					multicolor: true
				}),
				Table.configure({
					resizable: true
				}),
				TableRow,
				TableCell,
				TableHeader,
				CodeBlock
			],
			content: content,
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			}
		});
	});
	
	// 에디터 파괴
	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
	
	// 서식 적용 함수들
	function toggleBold(): void {
		editor.chain().focus().toggleBold().run();
	}
	
	function toggleItalic(): void {
		editor.chain().focus().toggleItalic().run();
	}
	
	function toggleUnderline(): void {
		editor.chain().focus().toggleUnderline().run();
	}
	
	function setHeading(level: Level): void {
		editor.chain().focus().toggleHeading({ level }).run();
	}
	
	function setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): void {
		editor.chain().focus().setTextAlign(align).run();
	}
	
	function toggleBulletList(): void {
		editor.chain().focus().toggleBulletList().run();
	}
	
	function toggleOrderedList(): void {
		editor.chain().focus().toggleOrderedList().run();
	}
	
	function toggleCodeBlock(): void {
		editor.chain().focus().toggleCodeBlock().run();
	}
	
	function addImage(): void {
		const url = window.prompt('이미지 URL 입력:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}
	
	function addLink(): void {
		const url = window.prompt('링크 URL 입력:');
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	}
	
	function insertTable(): void {
		editor.chain()
			.focus()
			.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
			.run();
	}
	
	function addColumnBefore(): void {
		editor.chain().focus().addColumnBefore().run();
	}
	
	function addColumnAfter(): void {
		editor.chain().focus().addColumnAfter().run();
	}
	
	function deleteColumn(): void {
		editor.chain().focus().deleteColumn().run();
	}
	
	function addRowBefore(): void {
		editor.chain().focus().addRowBefore().run();
	}
	
	function addRowAfter(): void {
		editor.chain().focus().addRowAfter().run();
	}
	
	function deleteRow(): void {
		editor.chain().focus().deleteRow().run();
	}
	
	function deleteTable(): void {
		editor.chain().focus().deleteTable().run();
	}
	
	function setColor(color: string): void {
		editor.chain().focus().setColor(color).run();
	}
	
	function setHighlight(color: string): void {
		editor.chain().focus().setHighlight({ color }).run();
	}
</script>

<div class="rich-text-editor">
	<div class="editor-toolbar">
		<div class="toolbar-group">
			<button type="button" on:click={toggleBold} class="toolbar-btn" class:is-active={editor?.isActive('bold')} title="굵게">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path></svg>
			</button>
			<button type="button" on:click={toggleItalic} class="toolbar-btn" class:is-active={editor?.isActive('italic')} title="기울임">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
			</button>
			<button type="button" on:click={toggleUnderline} class="toolbar-btn" class:is-active={editor?.isActive('underline')} title="밑줄">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line x1="4" y1="21" x2="20" y2="21"></line></svg>
			</button>
		</div>
		
		<span class="separator"></span>
		
		<div class="toolbar-group">
			<button type="button" on:click={() => setHeading(1)} class="toolbar-btn" class:is-active={editor?.isActive('heading', { level: 1 })} title="제목 1">
				H1
			</button>
			<button type="button" on:click={() => setHeading(2)} class="toolbar-btn" class:is-active={editor?.isActive('heading', { level: 2 })} title="제목 2">
				H2
			</button>
			<button type="button" on:click={() => setHeading(3)} class="toolbar-btn" class:is-active={editor?.isActive('heading', { level: 3 })} title="제목 3">
				H3
			</button>
		</div>
		
		<span class="separator"></span>
		
		<div class="toolbar-group">
			<button type="button" on:click={() => setTextAlign('left')} class="toolbar-btn" class:is-active={editor?.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
			</button>
			<button type="button" on:click={() => setTextAlign('center')} class="toolbar-btn" class:is-active={editor?.isActive({ textAlign: 'center' })} title="가운데 정렬">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
			</button>
			<button type="button" on:click={() => setTextAlign('right')} class="toolbar-btn" class:is-active={editor?.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
			</button>
			<button type="button" on:click={() => setTextAlign('justify')} class="toolbar-btn" class:is-active={editor?.isActive({ textAlign: 'justify' })} title="양쪽 정렬">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
			</button>
		</div>
		
		<span class="separator"></span>
		
		<div class="toolbar-group">
			<button type="button" on:click={toggleBulletList} class="toolbar-btn" class:is-active={editor?.isActive('bulletList')} title="글머리 기호">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
			</button>
			<button type="button" on:click={toggleOrderedList} class="toolbar-btn" class:is-active={editor?.isActive('orderedList')} title="번호 매기기">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
			</button>
		</div>
		
		<span class="separator"></span>
		
		<div class="toolbar-group">
			<button type="button" on:click={toggleCodeBlock} class="toolbar-btn" class:is-active={editor?.isActive('codeBlock')} title="코드 블록">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
			</button>
			<button type="button" on:click={addImage} class="toolbar-btn" title="이미지 삽입">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
			</button>
			<button type="button" on:click={addLink} class="toolbar-btn" class:is-active={editor?.isActive('link')} title="링크 삽입">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
			</button>
		</div>
		
		<span class="separator"></span>
		
		<div class="toolbar-group">
			<button type="button" on:click={insertTable} class="toolbar-btn" title="표 삽입">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
			</button>
			{#if editor?.isActive('table')}
				<div class="table-controls">
					<button type="button" on:click={addColumnBefore} class="toolbar-btn" title="왼쪽에 열 추가">←|</button>
					<button type="button" on:click={addColumnAfter} class="toolbar-btn" title="오른쪽에 열 추가">|→</button>
					<button type="button" on:click={deleteColumn} class="toolbar-btn" title="열 삭제">-|</button>
					<button type="button" on:click={addRowBefore} class="toolbar-btn" title="위에 행 추가">↑_</button>
					<button type="button" on:click={addRowAfter} class="toolbar-btn" title="아래에 행 추가">_↓</button>
					<button type="button" on:click={deleteRow} class="toolbar-btn" title="행 삭제">-_</button>
					<button type="button" on:click={deleteTable} class="toolbar-btn" title="표 삭제">×</button>
				</div>
			{/if}
		</div>
	</div>
	
	<div class="color-toolbar">
		<div class="color-group">
			<span class="color-label">글자색:</span>
			{#each colors as color}
				<button
					type="button"
					class="color-btn"
					style="background-color: {color}"
					on:click={() => setColor(color)}
					title={color}
				/>
			{/each}
		</div>
		<div class="color-group">
			<span class="color-label">배경색:</span>
			{#each colors as color}
				<button
					type="button"
					class="color-btn"
					style="background-color: {color}"
					on:click={() => setHighlight(color)}
					title={color}
				/>
			{/each}
		</div>
	</div>
	
	<div class="editor-content" bind:this={element}></div>
</div>

<style>
	.rich-text-editor {
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		overflow: hidden;
	}
	
	.editor-toolbar {
		display: flex;
		padding: 8px;
		background-color: #f7fafc;
		border-bottom: 1px solid #e2e8f0;
		flex-wrap: wrap;
		gap: 4px;
	}
	
	.toolbar-group {
		display: flex;
		gap: 4px;
	}
	
	.toolbar-btn {
		background: none;
		border: none;
		padding: 4px 8px;
		cursor: pointer;
		border-radius: 4px;
		color: #4a5568;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 28px;
		height: 28px;
	}
	
	.toolbar-btn:hover {
		background-color: #edf2f7;
		color: #2d3748;
	}
	
	.toolbar-btn.is-active {
		background-color: #e2e8f0;
		color: #2d3748;
	}
	
	.separator {
		display: inline-block;
		width: 1px;
		height: 24px;
		background-color: #e2e8f0;
		margin: 0 4px;
	}
	
	.color-toolbar {
		display: flex;
		padding: 8px;
		background-color: #f7fafc;
		border-bottom: 1px solid #e2e8f0;
		gap: 16px;
		flex-wrap: wrap;
	}
	
	.color-group {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}
	
	.color-label {
		font-size: 0.875rem;
		color: #4a5568;
		white-space: nowrap;
	}
	
	.color-btn {
		width: 20px;
		height: 20px;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		cursor: pointer;
		padding: 0;
		transition: transform 0.2s;
	}
	
	.color-btn:hover {
		transform: scale(1.1);
	}
	
	.table-controls {
		display: flex;
		gap: 2px;
	}
	
	.editor-content {
		padding: 16px;
		min-height: 300px;
		overflow-y: auto;
	}
	
	/* 에디터 내부 스타일 */
	:global(.ProseMirror) {
		outline: none;
	}
	
	:global(.ProseMirror p) {
		margin: 0 0 1em 0;
	}
	
	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
		margin: 1em 0;
	}
	
	:global(.ProseMirror h1) {
		font-size: 2em;
		margin: 1em 0 0.5em;
	}
	
	:global(.ProseMirror h2) {
		font-size: 1.5em;
		margin: 1em 0 0.5em;
	}
	
	:global(.ProseMirror h3) {
		font-size: 1.25em;
		margin: 1em 0 0.5em;
	}
	
	:global(.ProseMirror ul),
	:global(.ProseMirror ol) {
		padding-left: 2em;
		margin: 0 0 1em;
	}
	
	:global(.ProseMirror pre) {
		background-color: #2d3748;
		color: #e2e8f0;
		padding: 0.75em 1em;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1em 0;
	}
	
	:global(.ProseMirror code) {
		font-family: monospace;
	}
	
	:global(.ProseMirror table) {
		border-collapse: collapse;
		margin: 1em 0;
		overflow: hidden;
		width: 100%;
	}
	
	:global(.ProseMirror td),
	:global(.ProseMirror th) {
		border: 1px solid #e2e8f0;
		padding: 0.5em;
		position: relative;
		vertical-align: top;
	}
	
	:global(.ProseMirror th) {
		background-color: #f7fafc;
		font-weight: bold;
	}
	
	:global(.ProseMirror a) {
		color: #4299e1;
		text-decoration: underline;
	}
	
	:global(.ProseMirror a:hover) {
		color: #2b6cb0;
	}
</style> 