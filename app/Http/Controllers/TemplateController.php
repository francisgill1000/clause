<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $templates = Template::where('user_id', $userId)->get();

        return Inertia::render('Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'department' => 'nullable|string|max:100',
            'ribbon' => 'nullable|string|max:50',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['uses_count'] = 0;

        Template::create($validated);

        return redirect()->route('templates.index')->with('success', 'Template created.');
    }

    public function update(Request $request, Template $template)
    {
        abort_unless($template->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'department' => 'nullable|string|max:100',
            'ribbon' => 'nullable|string|max:50',
        ]);

        $template->update($validated);

        return redirect()->route('templates.index')->with('success', 'Template updated.');
    }

    public function destroy(Template $template)
    {
        abort_unless($template->user_id === auth()->id(), 403);

        $template->delete();

        return redirect()->route('templates.index')->with('success', 'Template deleted.');
    }
}
